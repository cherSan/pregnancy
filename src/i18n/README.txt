This folder contains localization resources for the app.

Files:
- en.json: English translations
- ru.json: Russian translations

Key naming:
- common.* for generic labels and small phrases
- validation.* for validation messages
- medications.* for medications-related UI
- backup.* for backup/restore alerts/buttons
- settings.* for settings view labels
- report.* for report PDF sections and timeline items

Integration suggestion:
Use any i18n library (e.g., i18next or react-intl) to load these JSON resources and replace hardcoded strings in the UI with translation keys. For React Native, i18next with react-i18next is a common choice.
