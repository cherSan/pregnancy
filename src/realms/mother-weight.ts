import { Realm } from 'realm';

export class MotherWeight extends Realm.Object<MotherWeight> {
    _id!: Realm.BSON.ObjectId;
    datetime!: Date;                 // дата создания записи
    value!: number;

    static schema: Realm.ObjectSchema = {
        name: 'MotherWeight',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            datetime: 'date',
            value: 'double',
        },
    };
}