## Взаимодействие между таблицей и Firestore

## Порядок взаимодействия между двумя классами через класс Task
1. serviceReadAll() -> "ON_UPDATE_SHEET:Типы деталей", null
2. -> PartTypesTab.onUpdateSheetEvent() -> "DB_READ_COLL", { coll_path, recipient: "UPDATE_SHEET:Типы деталей" }
3. -> AutocrashDB.read() -> "UPDATE_SHEET:Типы деталей", { fields }
4. -> PartTypesTab.updateSheetHandler()
