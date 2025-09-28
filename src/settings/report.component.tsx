import { useRealm } from "@realm/react";
import {Alert, Image} from "react-native";
import { useCallback } from "react";
import * as RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import ImageResizer from "react-native-image-resizer";
import RNBlobUtil from "react-native-blob-util";
import {useReactive} from "ahooks";
import { Hospital } from "../realms/hospital.ts";
import { Kick } from "../realms/kick.ts";
import { Medication } from "../realms/medication.ts";
import { MotherMood } from "../realms/mother-mood.ts";
import { MotherPressure } from "../realms/mother-pressure.ts";
import { MotherTemperature } from "../realms/mother-temperature.ts";
import { MotherWeight } from "../realms/mother-weight.ts";
import { Notes } from "../realms/notes.ts";
import {User} from "../realms/user.ts";
import {MedicationConfiguration} from "../realms/medication-configuration.ts";
import {Image as RImage} from "../realms/image.ts";
import {Button} from "../components/form/Button.component.tsx";
import { useT } from "../i18n";

function formatTime(hours: number, minutes: number) {
    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    return `${hh}:${mm}`;
}

export const Report = () => {
    const realm = useRealm();
    const t = useT();

    const state = useReactive({
        loading: false,
    })

    const resize = useCallback(async (
        bigBase64: string,
        targetWidth = 800,
        quality = 100,
    ) => {
        try {
            const tempPath = `${RNBlobUtil.fs.dirs.CacheDir}/temp.jpg`;
            await RNBlobUtil.fs.writeFile(tempPath, bigBase64, "base64");
            const { width: originalWidth, height: originalHeight } = await Image.getSize(`file://${tempPath}`);
            const targetHeight = Math.round((originalHeight / originalWidth) * targetWidth);
            const resized = await ImageResizer.createResizedImage(
                tempPath,
                targetWidth,
                targetHeight,
                "JPEG",
                quality
            );
            return await RNBlobUtil.fs.readFile(resized.uri, "base64");
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [])

    const onChange = useCallback(async () => {
        state.loading = true;
        try {
            const user = realm.objects(User)[0];
            const hospitals = realm.objects(Hospital).sorted("datetime", true);
            const kicks = realm.objects(Kick).sorted("datetime", true);
            const medications = realm.objects(Medication).filtered("realTime != nil").sorted("realTime", true);
            const medicationsPlan = realm.objects(MedicationConfiguration).sorted("planingTimeMinutes", true).sorted("planingTimeHours", true);
            const moods = realm.objects(MotherMood).sorted("datetime", true);
            const pressures = realm.objects(MotherPressure).sorted("datetime", true);
            const temperatures = realm.objects(MotherTemperature).sorted("datetime", true);
            const weights = realm.objects(MotherWeight).sorted("datetime", true);
            const notes = realm.objects(Notes).sorted("datetime", true);
            const images = realm.objects(RImage);
    
            const imageMap = new Map<string, string>();
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                if (!img.base64) continue;
                const smallBase64 = await resize(img.base64, 800, 100);
                if (smallBase64) {
                    imageMap.set(img._id.toString(), smallBase64);
                }
            }
            const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
        h1 { font-size: 20px; margin-bottom: 10px; }
        h2 { font-size: 16px; margin-top: 20px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        h3 { font-size: 14px; margin-top: 10px; }
        p { margin: 4px 0; }
        .images { display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; }
        .card { padding: 10px; margin-bottom: 10px; background-color: #eee; }
        .grouped { page-break-inside: avoid; }
        .important { color: #e56; }
        .report { margin-bottom: 10px; page-break-inside: avoid; overflow: hidden }
        .image-box { max-width: 300px; height: fit-content; margin-top: 5px; margin-bottom: 5px; page-break-inside: avoid; overflow: hidden }
      </style>
    </head>
    <body>
      <h1>${t('Report')}: ${new Date().toLocaleString()}</h1>
      <h2>${t('User')}: ${user.name}</h2>
      <h2>${t('DOB')}: ${user.dob?.toLocaleString()}</h2>
      <h2>${t('EDD')}: ${user.eddate?.toLocaleString()}</h2>
      <div class="report">
          <h2>${t('Hospital Visits')}</h2>
          ${hospitals.map(h => `
            <div class="card grouped">
                <p><b>${h.datetime.toLocaleString()}</b> - ${h.hospital} (${h.visitType || t('type?')})</p>
                <p><b>${t('Doctor')}:</b> ${h.doctor}</p>
                <p><b>${t('Questions')}:</b> ${h.questions}</p>
                <p><b>${t('Recommendations')}:</b> ${h.recommendations}</p>
                <h3>${t('Mother')}:</h3>
                <dl>
                  <dt>${t('Weight')}</dt>
                  <dd>${h.motherWeight?.value}</dd>
                  <dt>${t('Temperature')}</dt>
                  <dd>${h.motherTemperature?.value}</dd>
                  <dt>${t('Blood Pressure')}</dt>
                  <dd>${h.motherPressure?.valueTop}/${h.motherPressure?.valueBottom} - ${t('pulse')} ${h.motherPressure?.pulse}</dd>
                </dl>
                <h3>${t('Baby')}:</h3>
                <dl>
                  <dt>${t('Weight')}</dt>
                  <dd>${h.babyWeight}</dd>
                  <dt>${t('Head Size')}</dt>
                  <dd>${h.babyHeadSize}</dd>
                  <dt>${t('Heart Beat')}</dt>
                  <dd>${h.babyHeartBeat}</dd>
                </dl>
                <div class="images">
                    ${h.attachments
                        .map(img => imageMap.has(img._id.toString()) ? `<div class="image-box"><img alt="image" src="data:image/jpeg;base64,${imageMap.get(img._id.toString())}" width="300px" /></div>` : null)
                        .filter(i => !!i).join('')}
                </div>
            </div>
          `).join('')}
      </div>
      <div class="report">
          <h2>${t('Baby Kicks')}</h2>
          <div class="card">
            ${kicks.map(k => `<p><b>${k.datetime?.toLocaleString() || "-"}</b> - ${k.comment || ""}</p>`).join('')}
          </div>
      </div>
      <div class="report">
          <h2>${t('Medication Plan')}</h2>
          <div class="card">
            ${medicationsPlan.map(m => `<p><b>${formatTime(m.planingTimeHours, m.planingTimeMinutes)}</b> - ${m.name}</p>`).join('')}
          </div>
      </div>
      <div class="report">
          <h2>${t('Medications')}</h2>
          <div class="card">
            ${medications.filter((m) => !!m.realTime).map(m => `<p><b>${m.realTime?.toLocaleString()} (${t('plan')}: ${m.planingTime.toLocaleString()})</b> - ${m.name.toUpperCase()} ${m.comment || ""}</p>`).join('')}
          </div>
      </div>
      <div class="report">
          <h2>${t("Mother's Mood")}</h2>
          <div class="card">
            ${moods.filter(v => v.value).map(m => `<p><b>${m.datetime.toLocaleString()}</b> - ${m.value}</p>`).join('')}
          </div>
      </div>
      <div class="report">
          <h2>${t('Blood Pressure')}</h2>
          <div class="card">
            ${pressures.filter(v => v.valueTop && v.valueBottom).map(p => `<p><b>${p.datetime.toLocaleString()}</b> - ${p.valueTop}/${p.valueBottom} ${p.pulse ? `(${t('pulse')} ${p.pulse})` : ""}</p>`).join('')}
          </div>
      </div>
      <div class="report">
          <h2>${t('Temperature')}</h2>
          <div class="card">
            ${temperatures.filter(v => v.value).map(v => `<p><b>${v.datetime.toLocaleString()}</b> - ${v.value}${t('°C')}</p>`).join('')}
          </div>
      </div>
      <div class="report">
          <h2>${t('Weight')}</h2>
          <div class="card">
            ${weights.filter(v => v.value).map(w => `<p><b>${w.datetime.toLocaleString()}</b> - ${w.value} ${t('kg')}</p>`).join('')}
          </div>
      </div>
      <div class="report">
          <h2>${t('Notes')}</h2>
          <div class="card">
            ${notes.map(n => `<p><b>${n.datetime.toLocaleString()}</b> - ${n.title || ""} ${n.comment || ""} <span class="${n.important ? 'important': ''}">${n.important || ""}</span></p>`).join('')}
          </div>
      </div>
      <div class="report">
          <h2>${t('Full Chronology')}</h2>
          <div class="card">
          ${[...hospitals.map(h => ({ datetime: h.datetime, desc: `${t('Visit')}: ${h.hospital} (${h.visitType || t('type?')}) - ${h.doctor}`, isImportant: false })),
                ...kicks.map(k => k.datetime ? { datetime: k.datetime, desc: `${t('Kick')}: ${k.comment || ""}`, isImportant: false } : null).filter(Boolean),
                ...medications.filter((m) => !!m.realTime).map(m => ({ datetime: m.realTime!, desc: `${t('Medication')}: ${m.name} ${m.comment || ""}`, isImportant: false })), 
                ...moods.filter(v => v.value).map(m => ({ datetime: m.datetime, desc: `${t('Mood')}: ${m.value}`, isImportant: false })), 
                ...pressures.filter(v => v.valueBottom && v.valueTop).map(p => ({ datetime: p.datetime, desc: `${t('Pressure')}: ${p.valueTop}/${p.valueBottom} - ${p?.pulse ?? ''}`, isImportant: false })), 
                ...temperatures.filter(v => v.value).map(ti => ({ datetime: ti.datetime, desc: `${t('Temperature')}: ${ti.value}${t('°C')}`, isImportant: false })), 
                ...weights.filter(v => v.value).map(w => ({ datetime: w.datetime, desc: `${t('Weight')}: ${w.value} ${t('kg')}`, isImportant: false })), 
                ...notes.map(n => ({ datetime: n.datetime, desc: `${t('Note')}: ${n.title || ""} ${n.comment || ""} ${n.important ? n.important : ""}`, isImportant: !!n.important }))
            ].sort((a, b) => b!.datetime.getTime() - a!.datetime.getTime())
                .map(x => `<p class="${x!.isImportant ? "important" : ""}"><b>${x!.datetime.toLocaleString()}</b> - ${x!.desc}</p>`).join('')}
          </div>
      </div>
    </body>
  </html>
`;
            const file = await RNHTMLtoPDF.generatePDF({
                html,
                shouldPrintBackgrounds: false,
                padding: 10
            });
            await Share.open({
                url: `content://${file.filePath}`,
                type: "application/pdf",
                saveToFiles: true
            });
            console.log(t('Success'));
        } catch (e) {
            Alert.alert(t('Error'), String(e));
        } finally {
            state.loading = false;
        }
    }, [realm, resize, state, t]);

    return (
        <Button onPress={onChange} loading={state.loading} disabled={state.loading}>{t('Generate Report')}</Button>
    );
};
