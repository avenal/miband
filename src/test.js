"use strict";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function test_all(miband, log) {
  let info = {
    time: await miband.getTime(),
    battery: await miband.getBatteryInfo(),
    hw_ver: await miband.getHwRevision(),
    sw_ver: await miband.getSwRevision(),
    serial: await miband.getSerial()
  };

  log(`HW ver: ${info.hw_ver}  SW ver: ${info.sw_ver}`);
  info.serial && log(`Serial: ${info.serial}`);
  log(`Battery: ${info.battery.level}%`);
  log(`Time: ${info.time.toLocaleString()}`);

  // let ped = await miband.getPedometerStats();
  // log("Pedometer:", JSON.stringify(ped));

  // log("Heart Rate Monitor (single-shot)");
  // log("Result:", await miband.hrmRead());

  log("Heart Rate Monitor (continuous for 30 sec)...");
  miband.on("heart_rate", rate => {
    log("Heart Rate:", rate);
  });
  await miband.hrmStart();
  await delay(30000);
  await miband.hrmStop();
}

async function getHRMSingle(miband, log) {
  let existing = localStorage.getItem("heart_rate");
  let value = await miband.hrmRead();
  existing = existing ? JSON.parse(existing) : [];
  existing.push({ val: value, date: new Date().toLocaleTimeString() });
  localStorage.setItem("heart_rate", JSON.stringify(existing));
  log("Pomiar pulsu");
  log("Wynik:", value);
}

async function getHMRMultiple(miband, log) {
  let time = document.getElementById("time").value;
  let num = document.getElementById("num").value;
  // miband.on("heart_rate", rate => {
  //   log(rate);
  //   let existing = localStorage.getItem("heart_rate");

  //   // If no existing data, create an array
  //   // Otherwise, convert the localStorage string to an array
  //   existing = existing ? JSON.parse(existing) : [];

  //   // Add new data to localStorage Array
  //   existing.push({ val: rate, date: new Date().toLocaleTimeString() });

  //   // Save back to localStorage
  //   localStorage.setItem("heart_rate", JSON.stringify(existing));
  // });
  // await miband.hrmStart();
  let btn = document.getElementById("multiHeartRate");
  btn.disabled = true;
  for(let i = 0; i < num; i++)
  {
    getHRMSingle(miband, log);
    await delay(time*10000);
  }  
  btn.disabled = false;

}
async function HMRStop(miband, log) {
  await miband.hrmStop();
}

module.exports = { test_all, getHRMSingle, getHMRMultiple, HMRStop };
