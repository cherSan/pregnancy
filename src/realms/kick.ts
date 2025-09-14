import { Realm } from 'realm';

export class Kick extends Realm.Object {
    static schema = {
        name: 'Kick',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            datetime: 'date?',
            comment: 'string?',
        },
    };

    _id!: Realm.BSON.ObjectId;
    datetime: Date = new Date();
    comment?: string;
}
