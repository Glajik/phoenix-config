/**
 * Тестирование
 * Must implement doTests() method, which is interface for IntegrationTests class
 * **Method must return TestModule object**
 */
class Task_Test {
  constructor() {
    this.test = new TestModule('Task_IntegrationTest');
  }

  /**
   * Test interface
   */
  doTests() {
    const { test } = this;
    // Тестирование сообщений и обработчиков

    // TODO:
    // 1. регистрация 2 тестовых обработчиков
    // 2. регистрация 1 тестового сообщения
    // 3. отправка сообщения, которое:
    //   - должно быть обработанно обоими -> вернуть [ true, true ]
    //   - должно быть обработанно одним из них -> вернуть [ true, false ]
    //   - не должно быть обработано ими, но содержится в списке ключей -> [ false, false ]
    //   - которое отсутствует в списке ключей, и не должно быть обработано -> throw exception
  
    test.make('Попробуем послать сообщение, и ожидаем ответ от одного обработчика', () => {
      // const result = data.filter(device => device.device_id === 'SH100000001');
      // if (result.length !== 1) throw `Must be only one registered device with device_id 'SH100000001', but here is ${result.length}`;
    });

    return test;
  }

  /**
   * Register new device by heartbeat message.
   * 1. Send one heartbeat message.
   * 2. Expected appended new row in "Message Database" tab
   * 3. Expected inserted new row at the top in "Sani devices" tab
   */
  test_registerNewDevice() {
    const { test, webservice } = this;

    test.make('Registering new device', () => {
      const hbMessage = new MessageBody_Heartbeat_TestHelper()
      .device_id('SH100000001')
      .device_name('TEST DEVICE 1')
      .create();

      webservice.call_doPost(hbMessage, 1, 'heartbeats', 'direct');
    });

    // Sani devices
    test.make('Check inserting registered device at the top in "Sani device" tab', () => {
      const name = 'Sani devices';
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
      const device_id = sheet.getRange(`C2`).getValue();
      const device_name = sheet.getRange(`D2`).getValue();
      test.isEqual(device_id, 'SH100000001');
      test.isEqual(device_name, 'TEST DEVICE 1');
    });
  };

    /**
   * Register new device by heartbeat message.
   * 1. Send one heartbeat message.
   * 2. Expected appended new row in "Message Database" tab
   * 3. Expected inserted new row at the top in "Sani devices" tab
   */
  test_registerNewTempDevice() {
    const { test, webservice } = this;

    test.make('Registering new temp device', () => {
      const tempMessage = new MessageBody_Temp_C_TestHelper()
      .device_id('SH100000001')
      .device_name('TEST DEVICE 1')
      .temp_id('1000')
      .create();

      webservice.call_doPost(tempMessage, 1, 'production', 'direct');
    });

    // Temp devices
    test.make('Check inserting registered device at the top in "Temp device" tab', () => {
      const name = 'Temp devices';
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
      const device_id = sheet.getRange(`C2`).getValue();
      const device_name = sheet.getRange(`D2`).getValue();
      const temp_id = sheet.getRange(`E2`).getValue();
      test.isEqual(device_id, 'SH100000001');
      test.isEqual(device_name, 'TEST DEVICE 1');
      test.isEqual(temp_id, 1000);
    });
  }

  /**
   * Check default params of registered device in "Sani devices" tab
   */
  test_checkDefaultParamsOnSaniDevicesTab() {
    const { test } = this;

    test.make('Check default params of registered device in "Sani devices" tab', () => {
      const device = new SaniDevices().getDeviceById('SH100000001');

      if (!device) throw `At tab no device with ${'SH100000001'}`;

      const {
        rowId,
        unread,
        datestamp,
        device_id,
        device_name,
        client_id,
        ppm_alarm,
        strip_lower,
        strip_upper,
        hb_timeout_alarm,
        hb_timeout_alarm_minutes,
        time_from_last_heartbeat,
        last_heartbeat_time,
        notification_sent_at
      } = device;

      if (rowId !== 2) throw `Must be at row 2`;

      if (unread !== true) throw 'unread should be true by default';

      if (!datestamp instanceof Date) throw `datestamp isn't Date type`;
      
      if (device_name !== 'TEST DEVICE 1') throw `device_name !== ${'TEST DEVICE 1'}`;
      
      if (client_id !== '') throw `client_id must be blank by default`;
      
      if (ppm_alarm !== false) throw `ppm_alarm must be unchecked by default`;
      
      if (strip_lower !== 'NA') throw `strip_lower must be NA by default`;

      if (strip_upper !== 'NA') throw `strip_upper must be NA by default`;
      
      if (hb_timeout_alarm !== true) throw `hb_timeout_alarm must be checked by default`;
      
      if (hb_timeout_alarm_minutes !== 35) throw `hb_timeout_alarm_minutes default must be 35, but here is ${hb_timeout_alarm_minutes}`;

      if (time_from_last_heartbeat !== 0) throw `time_from_last_heartbeat must be zero`;

      if (!last_heartbeat_time instanceof Date) throw `last_heartbeat_time must be Date type`;

      if (notification_sent_at !== '') throw `notification_sent_at must be blank by default`;
      
      if (datestamp.toString() !== last_heartbeat_time.toString()) throw `datestamp and last_heartbeat_time must be equal, because it is first time that device was registered`;
    });
  };

  /**
   * Check default parameters of temp device on "Temp devices" tab
   * (There is new, more compact method)
   */
  test_checkDefaultParamsOnTempDevicesTab() {
    const { test } = this;

    test.make('Check default parameters of registered temp device on "Temp devices" tab', () => {
      const tempDevice = new TempDevices().getTempDeviceById('1000');

      if (!tempDevice) throw `At tab no temp device with temp_d = ${'1000'}`;

      const compareWithDefault = test.compareWith({
        rowId: 2,
        unread: true,
        // datestamp: new Date();
        device_id: 'SH100000001',
        device_name: 'TEST DEVICE 1',
        temp_id: '1000',
        temp_alias: 'default',
        temp_alarm: false,
        temp_limit: 'NA',
        timeout_alarm: true,
        timeout_alarm_minutes: 35,
        time_from_last_message: 0,
        // last_message_time: new Date(),
        notification_sent_at: '',
      });

      compareWithDefault(tempDevice);

      const { datestamp, last_message_time } = tempDevice;
      
      if (!datestamp instanceof Date) throw `datestamp isn't Date type`;
      
      if (!last_message_time instanceof Date) throw `last_message_time isn't Date type`;
      
      if (datestamp.toString() !== last_message_time.toString()) throw `datestamp and last_message_time must be equal, because it is first time that device was registered`;
    });    
  };
}