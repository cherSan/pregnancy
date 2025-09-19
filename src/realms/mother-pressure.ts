import { Realm } from 'realm';

export class MotherPressure extends Realm.Object<MotherPressure> {
    _id!: Realm.BSON.ObjectId;
    datetime!: Date;
    valueTop!: number;
    valueBottom!: number;

    static schema: Realm.ObjectSchema = {
        name: 'MotherPressure',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            datetime: 'date',
            valueTop: 'double',
            valueBottom: 'double',
        },
    };
}