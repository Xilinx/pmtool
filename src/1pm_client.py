# Copyright (C) 2024 Advanced Micro Devices, Inc.  All rights reserved.
# SPDX-License-Identifier: MIT


class PM_Client(object):
    PM = None

    def GetValuesAll(self):
        """
        Gets the boards's all domain's rails sensor values

        :param : None
        :return: The board's all rails sensor values of the Rail in json formatted
        """
        data = {
            "VCK190": [
                {
                    "FPD": {
                        "Rails": [
                            {
                                "VCCINT_PSFP": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                            {
                                "MGTAVCC": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                            {
                                "MGTACTT": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                            {
                                "VCCO_PSDDR_504": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                            {
                                "VCCPMDDRPLL": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                        ],
                        "Total Power": 0.1423
                    }
                },
                {
                    "LPD": {
                        "Rails": [
                            {
                                "VCCPENTLP": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                            {
                                "VCCPSAUX": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                            {
                                "VCCPSPLL": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                            {
                                "VCCOPS": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                            {
                                "VCCOPS3": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                        ],
                        "Total Power": 0.142367
                    }
                },
                {
                    "PLD": {
                        "Rails": [
                            {
                                "VCCINT": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                            {
                                "VCCBRAM": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                            {
                                "VCCAUX": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                            {
                                "VCCTV2": {
                                    "Voltage": 0.7988,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                            {
                                "VCCTV3": {
                                    "Voltage": 0.792288,
                                    "Current": 0.178,
                                    "Power": 0.1423
                                }
                            },
                        ],
                        "Total Power": 0.1423
                    }
                }
        ]
        }
        return data

    def GetBoardInfo(self):
        board = {
              "Language": 0,
              "Manufacturer": "XILINX",
              "Product Name": "VCK190",
              "Board Serial Number": "511201B01057",
              "Board Part Number": "430511201",
              "Board Revision": ""
        }
        return board
    def GetSysmonTemperatures(self):
        ps_temp = {
                      "TEMP": 30.0,
                      "MIN": 0.0,
                      "MAX_MAX": 0.0,
                      "MIN_MIN": 0.0
                    }
        return ps_temp
    def GetPowersAll(self):
        total_power = {
                          "VCK190": {
                            "Power Domains": [
                              {
                                "FPD": {
                                  "Power": 0.5539
                                }
                              },
                              {
                                "LPD": {
                                  "Power": 0.2545
                                }
                              },
                              {
                                "PLD": {
                                  "Power": 9.2938
                                }
                              },
                              {
                                "PMC": {
                                  "Power": 0.4543
                                }
                              },
                              {
                                "GTM": {
                                  "Power": 0.5312
                                }
                              },
                              {
                                "GTY": {
                                  "Power": 0.0605
                                }
                              },
                              {
                                "FMC": {
                                  "Power": 0.6335
                                }
                              },
                              {
                                "HBM": {
                                  "Power": 0.4582
                                }
                              },
                              {
                                "system": {
                                  "Power": 4.9275
                                }
                              },
                              {
                                "chip": {
                                  "Power": 16.7441
                                }
                              }
                            ],
                            "Total Power": 33.9115
                          }
                        }
        return total_power
pm = PM_Client()



