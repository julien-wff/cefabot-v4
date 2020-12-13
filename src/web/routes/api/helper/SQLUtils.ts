import sqlite from 'sqlite3';


export const sqlAll = (db: sqlite.Database, sql: string, params: any = []) => new Promise<any[]>(((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
        if (err)
            reject(err);
        else
            resolve(rows);
    });
}));


export function formatSQLError(err: unknown): string {
    if (err instanceof Error)
        return err.message;
    else if (typeof err === 'object' && err?.hasOwnProperty('code'))
        return (err as { code: string }).code;
    else
        return err as string;
}

