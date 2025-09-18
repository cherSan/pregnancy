import { Realm } from 'realm';

export class Notes extends Realm.Object {
    static schema = {
        name: 'Notes',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            datetime: 'date',
            title: 'string?',
            comment: 'string?',
            important: 'string?',
        },
    };

    _id!: Realm.BSON.ObjectId;
    datetime: Date = new Date();
    title?: string;
    comment?: string;
    important?: string;
}
