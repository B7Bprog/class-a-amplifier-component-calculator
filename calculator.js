const inquirer = require("inquirer");
const calculator = () => {
  const questions = [
    {
      type: "input",
      name: "supply_voltage",
      message: "Type supply voltage (Vcc) (< Vceo): ",
    },
    {
      type: "input",
      name: "hfe_value",
      message: "Type Hfe value:  ",
      default() {
        return "150";
      },
    },
    {
      type: "input",
      name: "quiescent_collector_current",
      message: "Type the Quiescent Collector Current (10-20% of Ic(max)): ",
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    const Vcc_supply_voltage = Number(answers.supply_voltage);
    const hfe_value = Number(answers.hfe_value);
    const quiescent_collector_current = Number(
      answers.quiescent_collector_current
    );

    const quiescent_collector_voltage = Vcc_supply_voltage / 2;
    const collector_load_resistor = Math.round(
      quiescent_collector_voltage / quiescent_collector_current
    );
    const emitter_voltage = (Vcc_supply_voltage / 100) * 12;
    const emitter_resistor = Math.round(
      emitter_voltage / quiescent_collector_current
    );

    const base_current = quiescent_collector_current / hfe_value;
    const base_voltage = Math.round((emitter_voltage + 0.7) * 10) / 10;
    const bias_network_current = base_current * 10;
    const upper_base_resistor = Math.round(
      (Vcc_supply_voltage - base_voltage) / bias_network_current
    );
    const lower_base_resistor = Math.round(base_voltage / bias_network_current);

    const max_rms_voltage = (Vcc_supply_voltage / 2) * Math.sqrt(2);
    const max_rms_output_power =
      Math.round(
        (Math.pow(max_rms_voltage, 2) / collector_load_resistor) * 10
      ) / 10;
    const initialParameters = {
      "Supply Voltage (Vcc) (Volts)": Vcc_supply_voltage,
      Hfe: hfe_value,
      "Quiescent Collector Current (Ic) (Amps)": quiescent_collector_current,
    };
    const calculatedValues = {
      "Collector Resistor (Rc) (OHMs)": collector_load_resistor,
      "Emitter Resistor (Re) (OHMs)": emitter_resistor,
      "Upper Base Resistor (Rb) (OHMs)": upper_base_resistor,
      "Lower Base Resistor (Rb) (OHMs)": lower_base_resistor,
      "Maximum RMS Output Power (Prms) (Watts)": max_rms_output_power,
    };
    console.log();
    console.log("\x1b[36m%s\x1b[0m", "Initial parameters");
    console.table(initialParameters);
    console.log("\x1b[35m%s\x1b[0m", "Results");
    console.table(calculatedValues);
    inquirer.prompt({ type: "input", name: "Hit Enter to exit" });
  });
};
calculator();
