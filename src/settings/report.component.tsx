import { useRealm } from "@realm/react";
import { DatePicker } from "@ant-design/react-native";
import { useCallback } from "react";
import * as RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import { List } from "../components/list.component.tsx";
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



export const Report = () => {
    const realm = useRealm();

    const onChange = useCallback(async (fromDate: Date) => {
        const user = realm.objects(User)[0];
        const hospitals = realm.objects(Hospital).filtered("datetime >= $0", fromDate).sorted("datetime", true);
        const kicks = realm.objects(Kick).filtered("datetime >= $0", fromDate).sorted("datetime", true);
        const medications = realm.objects(Medication).filtered("realTime >= $0 AND realTime != nil", fromDate).sorted("realTime", true);
        const medicationsPlan = realm.objects(MedicationConfiguration).sorted("planingTimeHours", true).sorted("planingTimeMinutes", true);
        const moods = realm.objects(MotherMood).filtered("datetime >= $0", fromDate).sorted("datetime", true);
        const pressures = realm.objects(MotherPressure).filtered("datetime >= $0", fromDate).sorted("datetime", true);
        const temperatures = realm.objects(MotherTemperature).filtered("datetime >= $0", fromDate).sorted("datetime", true);
        const weights = realm.objects(MotherWeight).filtered("datetime >= $0", fromDate).sorted("datetime", true);
        const notes = realm.objects(Notes).filtered("datetime >= $0", fromDate).sorted("datetime", true);
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
        img { max-width: 300px; height: auto; margin-top: 5px; margin-bottom: 5px; }
        .card { padding: 10px; margin-bottom: 10px; background-color: #eee; }
      </style>
    </head>
    <body>
      <h1>Report (${fromDate.toLocaleDateString()} - ${new Date().toLocaleDateString()})</h1>
      <h2>User: ${user.name}</h2>
      <h2>EDD: ${user.eddate?.toLocaleString()}</h2>
      <h2>DOB: ${user.dob?.toLocaleString()}</h2>

      <h2>Hospital Visits</h2>
      ${hospitals.map(h => `
        <div class="card">
            <p><b>${h.datetime.toLocaleString()}</b> - ${h.hospital} (${h.visitType || "type?"})</p>
            <p><b>Doctor:</b> ${h.doctor}</p>
            <p><b>Questions:</b> ${h.questions}</p>
            <p><b>Recomendations:</b> ${h.recommendations}</p>
            <h3>Mother:</h3>
            <dl>
              <dt>Weight</dt>
              <dd>${h.motherWeight?.value}</dd>
              <dt>Temperature</dt>
              <dd>${h.motherTemperature?.value}</dd>
              <dt>Pressure</dt>
              <dd>${h.motherPressure?.valueTop}/${h.motherPressure?.valueBottom} - ${h.motherPressure?.pulse}</dd>
            </dl>
            <h3>Baby:</h3>
            <dl>
              <dt>Weight</dt>
              <dd>${h.babyWeight}</dd>
              <dt>Head Size</dt>
              <dd>${h.babyHeadSize}</dd>
              <dt>Heart Beat</dt>
              <dd>${h.babyHeartBeat}</dd>
            </dl>
            <div class="images">
                ${h.attachments.map(img => img.base64 ? `<img src="data:image/jpeg;base64,${img.base64}" />` : '').join('')}
            </div>
        </div>
      `).join('')}

      <h2>Baby Kicks</h2>
      <div class="card">
        ${kicks.map(k => `<p><b>${k.datetime?.toLocaleString() || "-"}</b> - ${k.comment || ""}</p>`).join('')}
      </div>
      <h2>Medication Plan</h2>
      <div class="card">
        ${medicationsPlan.map(m => `<p><b>${m.planingTimeHours}:${m.planingTimeMinutes}</b> - ${m.name}</p>`).join('')}
      </div>

      <h2>Medications</h2>
      <div class="card">
        ${medications.filter((m) => !!m.realTime).map(m => `<p><b>${m.realTime?.toLocaleString()} (${m.planingTime.toLocaleString()})</b> - ${m.name} ${m.comment || ""}</p>`).join('')}
      </div>
      <h2>Mother's Mood</h2>
      <div class="card">
        ${moods.map(m => `<p><b>${m.datetime.toLocaleString()}</b> - ${m.value}</p>`).join('')}
      </div>
      <h2>Blood Pressure</h2>
      <div class="card">
        ${pressures.map(p => `<p><b>${p.datetime.toLocaleString()}</b> - ${p.valueTop}/${p.valueBottom} ${p.pulse ? `(pulse ${p.pulse})` : ""}</p>`).join('')}
      </div>
      <h2>Temperature</h2>
      <div class="card">
        ${temperatures.map(t => `<p><b>${t.datetime.toLocaleString()}</b> - ${t.value}°C</p>`).join('')}
      </div>
      <h2>Weight</h2>
      <div class="card">
        ${weights.map(w => `<p><b>${w.datetime.toLocaleString()}</b> - ${w.value} kg</p>`).join('')}
      </div>
      <h2>Notes</h2>
      <div class="card">
        ${notes.map(n => `<p><b>${n.datetime.toLocaleString()}</b> - ${n.title || ""} ${n.comment || ""}</p>`).join('')}
      </div>
      <h2>Full Chronology</h2>
      <div class="card">
      ${[...hospitals.map(h => ({ datetime: h.datetime, desc: `Visit: ${h.hospital} (${h.visitType || "type?"}) - ${h.doctor}` })),
            ...kicks.map(k => k.datetime ? { datetime: k.datetime, desc: `Kick: ${k.comment || ""}` } : null).filter(Boolean),
            ...medications.filter((m) => !!m.realTime).map(m => ({ datetime: m.realTime!, desc: `Medication: ${m.name} ${m.comment || ""}` })),
            ...moods.map(m => ({ datetime: m.datetime, desc: `Mood: ${m.value}` })),
            ...pressures.map(p => ({ datetime: p.datetime, desc: `Blood Pressure: ${p.valueTop}/${p.valueBottom} - ${p?.pulse}` })),
            ...temperatures.map(t => ({ datetime: t.datetime, desc: `Temperature: ${t.value}°C` })),
            ...weights.map(w => ({ datetime: w.datetime, desc: `Weight: ${w.value} kg` })),
            ...notes.map(n => ({ datetime: n.datetime, desc: `Note: ${n.title || ""} ${n.comment || ""}` }))
        ].sort((a, b) => b!.datetime.getTime() - a!.datetime.getTime())
            .map(t => `<p><b>${t!.datetime.toLocaleString()}</b> - ${t!.desc}</p>`).join('')}
      </div>
    </body>
  </html>
`;

        const options = {
            html,
        };
        try {
            const file = await RNHTMLtoPDF.generatePDF(options);
            await Share.open({
                url: `file://${file.filePath}`,
                type: "application/pdf",
                saveToFiles: true
            });
            console.log("Share открылся");
        } catch (e) {
            console.log("Share ошибка:", e);
        }
    }, [realm]);

    return (
        <DatePicker value={undefined} onChange={onChange}>
            <List.Item arrow title="Сформировать отчет начиная с" />
        </DatePicker>
    );
};
