import { Realm } from 'realm';

export class User extends Realm.Object {
    static schema = {
        name: 'User',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            name: 'string',
            dob: 'date?',
        },
    };

    _id!: Realm.BSON.ObjectId;
    name!: string;
    dob?: Date;
}