import { Realm } from 'realm';

export class Medication extends Realm.Object {
    static schema = {
        name: 'Medication',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            name: 'string',
            realTime: 'date?',
            planingTime: 'date?',
            comment: 'string?',
            hasComment: 'bool',
        },
    };

    _id!: Realm.BSON.ObjectId;
    name!: string;
    planingTime?: Date;
    realTime?: Date;
    comment?: string;
    hasComment: boolean = false;
}
