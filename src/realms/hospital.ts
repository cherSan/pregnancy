import { Realm } from 'realm';
import {MotherWeight} from "./mother-weight.ts";
import {MotherPressure} from "./mother-pressure.ts";
import {MotherTemperature} from "./mother-temperature.ts";

export class Hospital extends Realm.Object<Hospital> {
    _id!: Realm.BSON.ObjectId;
    datetime!: Date;                  // дата и время визита
    doctor!: string;                  // врач
    hospital!: string;                // название/клиника
    visitType?: string;               // тип визита: плановый, УЗИ, анализы, скрининг и т.п.
    isCompleted?: boolean;            // был ли визит фактически

    // Вопросы и рекомендации
    questions!: string[];
    recommendations?: string;

    // Показатели мамы
    motherWeight?: MotherWeight;            // вес матери (кг)
    motherPressure?: MotherPressure;           // давление: "120/80"
    motherTemperature?: MotherTemperature;             // температура (°C)

    // Показатели ребёнка
    babyWeight?: number;              // вес плода (г)
    babySize?: number;                // длина плода (см)
    babyHeadSize?: number;            // окружность головы (мм)
    babyHeartBeat?: number;           // сердцебиение (уд/мин)
    eddUS?: Date;                     // EDD по УЗИ
    ultrasoundNotes?: string;         // текстовое описание УЗИ

    // Дополнительно
    attachments!: string[];           // файлы: pdf, jpg, doc и т.п.
    tags!: string[];                  // теги для фильтрации

    createdAt!: Date;                 // дата создания записи
    updatedAt!: Date;                 // дата последнего изменения

    static schema: Realm.ObjectSchema = {
        name: 'Hospital',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            datetime: 'date',
            doctor: 'string',
            hospital: 'string',
            visitType: 'string?',
            isCompleted: 'bool?',

            questions: 'string[]',
            recommendations: 'string?',

            motherWeight: "MotherWeight?",
            motherPressure: "MotherPressure?",
            motherTemperature: "MotherTemperature?",

            bloodPressure: 'string?',
            temperature: 'float?',

            babyWeight: 'float?',
            babySize: 'float?',
            babyHeadSize: 'float?',
            babyHeartBeat: 'float?',
            eddUS: 'date?',
            ultrasoundNotes: 'string?',

            attachments: 'string[]',
            tags: 'string[]',

            createdAt: 'date',
            updatedAt: 'date',
        },
    };
}