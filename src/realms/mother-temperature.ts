import { Realm } from 'realm';

export class MotherTemperature extends Realm.Object<MotherTemperature> {
    _id!: Realm.BSON.ObjectId;
    datetime!: Date;                 // дата создания записи
    value!: number;

    static schema: Realm.ObjectSchema = {
        name: 'MotherTemperature',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            datetime: 'date',
            value: 'double',
        },
    };
}