"use strict";

import Chart from "chart.js";
import MiBand from "./miband";
import { test_all, getHRMSingle, getHMRMultiple, HMRStop } from "./test";

import "./styles/index.less";

const bluetooth = navigator.bluetooth;

const output = document.querySelector("#output");

let data = localStorage.getItem("heart_rate").split(",");

function log() {
  document.querySelector("main").style.display = "block";

  output.innerHTML += [...arguments].join(" ") + "\n";
}

async function scan() {
  if (!bluetooth) {
    log("WebBluetooth is not supported by your browser!");
    return;
  }

  try {
    log("Requesting Bluetooth Device...");
    const device = await bluetooth.requestDevice({
      filters: [{ services: [MiBand.advertisementService] }],
      optionalServices: MiBand.optionalServices
    });

    device.addEventListener("gattserverdisconnected", () => {
      log("Device disconnected");
    });

    await device.gatt.disconnect();

    log("Connecting to the device...");
    const server = await device.gatt.connect();
    log("Connected");
    document.getElementById("singleHeartRate").disabled = false;
    let miband = new MiBand(server);

    await miband.init();
    document.getElementById("singleHeartRate").addEventListener("click", () => {
      getHRMSingle(miband, log);
    });

    document.getElementById("multiHeartRate").addEventListener("click", () => {
      getHMRMultiple(miband, log);
      data = localStorage.getItem("heart_rate").split(",");
      console.log(data);
      chart.update();
    });

    document.getElementById("stop").addEventListener("click", () => {
      HMRStop(miband, log);
    });
    // await test_all(miband, log);
  } catch (error) {
    log("Argh!", error);
  }
}

let ctx = document.getElementById("chart").getContext("2d");

let options = {
  scales: {
    yAxes: [
      {
        ticks: {
          reverse: false
        }
      }
    ]
  }
};

let chart = new Chart(ctx, {
  data: data,
  options: options
});

document.querySelector("#scanBtn").addEventListener("click", scan);
