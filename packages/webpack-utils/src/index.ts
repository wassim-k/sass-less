export * from './memoize';
import type { RuleSetLoader, RuleSetQuery, RuleSetRule, RuleSetUse, RuleSetUseItem } from 'webpack';

export function appendLoader(rule: RuleSetRule, useItem: RuleSetUseItem): RuleSetRule {
  return processLoader(rule, {
    append: [useItem]
  });
}

export function modifyLoader(
  rule: RuleSetRule,
  loaderName: string,
  modify: (useItem: string | RuleSetLoader) => RuleSetUseItem,
  strict?: boolean
): RuleSetRule {
  return processLoader(rule, {
    modify: useItem => typeof useItem === 'function' || !useItemHasLoader(loaderName, useItem, strict)
      ? useItem
      : modify(useItem)
  });
}

export function modifyLoaderOptions(
  rule: RuleSetRule,
  loaderName: string,
  modify: (options: RuleSetQuery | undefined) => RuleSetQuery
): RuleSetRule {
  return modifyLoader(rule, loaderName, useItem => {
    return typeof useItem === 'string'
      ? { loader: useItem, options: modify(undefined) }
      : { ...useItem, options: modify(useItem.options) }
  });
}

export function hasLoader(rule: RuleSetRule, loaderName: string, strict?: boolean): boolean {
  const { loader, loaders, use, oneOf, rules } = rule;
  return (
    ([] as Array<any>).concat(loader ?? loaders ?? use ?? []).some(use => useItemHasLoader(loaderName, use, strict)) ||
    ([] as Array<any>).concat(oneOf ?? rules ?? []).some(r => hasLoader(r, loaderName, strict))
  );
}

export function useItemHasLoader(loaderName: string, use: RuleSetUseItem, strict?: boolean): boolean {

  const comparer = (loader: string | undefined) => strict === true
    ? loaderName === loader
    : loader?.includes(loaderName) ?? false;

  return typeof use === 'string'
    ? comparer(use)
    : typeof use === 'object'
      ? comparer(use.loader)
      : false;
}

export function processLoader(rule: RuleSetRule, { modify, append }: {
  modify?: (useItem: RuleSetUseItem) => RuleSetUseItem;
  append?: Array<RuleSetUseItem>;
}): RuleSetRule {

  const preprocess = (use: RuleSetUse): RuleSetUse => {
    if (typeof use === 'function') throw new Error('Functional loaders are not supported');
    let newUse: RuleSetUseItem | Array<RuleSetUseItem> = use;
    if (modify) newUse = Array.isArray(newUse) ? newUse.map(modify) : modify(newUse);
    if (append) newUse = Array.isArray(newUse) ? [...newUse, ...append] : [newUse, ...append];
    return newUse;
  };

  if (rule.loaders) {
    return { ...rule, loaders: preprocess(rule.loaders) };
  } else if (rule.loader) {
    return { ...rule, loader: preprocess(rule.loader) };
  } else if (rule.use) {
    return { ...rule, use: preprocess(rule.use) };
  } else if (rule.oneOf) {
    return { ...rule, oneOf: rule.oneOf.map(r => processLoader(r, { modify, append })) };
  } else if (rule.rules) {
    return { ...rule, rules: rule.rules.map(r => processLoader(r, { modify, append })) };
  }

  return rule;
}
