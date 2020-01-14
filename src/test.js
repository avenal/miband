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
  log("Heart Rate Monitor (single-shot)");
  log("Result:", await miband.hrmRead());
}

async function getHMRMultiple(miband, log) {
  miband.on("heart_rate", rate => {
    log(rate);
    let existing = localStorage.getItem("heart_rate");

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? existing.split(",") : [];

    // Add new data to localStorage Array
    existing.push(rate);

    // Save back to localStorage
    localStorage.setItem("heart_rate", existing.toString());
  });
  await miband.hrmStart();
}
async function HMRStop(miband, log) {
  await miband.hrmStop();
}

module.exports = { test_all, getHRMSingle, getHMRMultiple, HMRStop };