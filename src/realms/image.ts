import { Realm } from 'realm';

export class Image extends Realm.Object<Image> {
    _id!: Realm.BSON.ObjectId;
    base64!: string;
    fileName?: string;
    fileSize?: number;
    height?: number;
    width?: number;
    originalPath?: string;
    type?: string;
    uri?: string;
    createdAt: Date = new Date();

    static schema: Realm.ObjectSchema = {
        name: 'Image',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            base64: 'string',
            fileName: 'string?',
            fileSize: 'int?',
            height: 'int?',
            width: 'int?',
            originalPath: 'string?',
            type: 'string?',
            uri: 'string?',
            createdAt: 'date',
        },
    };
}