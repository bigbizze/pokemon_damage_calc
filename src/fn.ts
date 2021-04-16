type StatReducer<T, K extends keyof T> = (acc: Entry<T, K>[], next: T[K]) => Entry<T, K>[];
type Entry<T, K extends keyof T> = [ string, Partial<T[K]> ];
type OnOk<T, K extends keyof T> = (v: T[K]) => Entry<T, K>[];

export const sometimes_make_obj = <T, K extends keyof T>(on_ok: OnOk<T, K>, acc: Entry<T, K>[], next: T[K]): Entry<T, K>[] =>
    next ? on_ok(next) : acc;

export const concat_entries = <T, K extends keyof T>(next: T[K], acc: Entry<T, K>[]): Entry<T, K>[] =>
    sometimes_make_obj(v => acc.concat(Object.entries(v)), acc, next)
        .map((x): Entry<T, K> => [ x[0], x[1] ]);

export const reduce_objs = <T, K extends keyof T>(reducer: StatReducer<T, K>, ...objs: T[K][]) =>
    objs.reduce(reducer, []);
