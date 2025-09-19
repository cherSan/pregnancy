import { Realm } from 'realm';

export class MotherMood extends Realm.Object<MotherMood> {
    _id!: Realm.BSON.ObjectId;
    datetime!: Date;
    value!: number;

    static schema: Realm.ObjectSchema = {
        name: 'MotherMood',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            datetime: 'date',
            valueTop: 'int',
        },
    };
}