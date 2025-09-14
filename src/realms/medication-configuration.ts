import { Realm } from 'realm';

export class MedicationConfiguration extends Realm.Object {
    static schema = {
        name: 'MedicationConfiguration',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            name: 'string',
            planingTimeHours: 'int',
            planingTimeMinutes: 'int',
            hasComment: 'bool',
        },
    };

    _id!: Realm.BSON.ObjectId;
    name!: string;
    planingTimeHours!: number;
    planingTimeMinutes!: number;
    hasComment: boolean = false;
}
