const categories_ids = [
  "c1",
  "c23"
]

const categories=  [
  {
    "id": "C1",
    "descriptor": {
      "name": "People",
      "code": "PEOPLE"
    },
    "tags": [
      {
        "descriptor": {
          "code": "Selection"
        },
        "list": [
          {
            "descriptor": {
              "code": "seq"
            },
            "value": "1"
          },
          {
            "descriptor": {
              "code": "mandatory_selection"
            },
            "value": "true"
          }
        ]
      }
    ]
  },
  {
    "id": "C2",
    "descriptor": {
      "name": "Meal",
      "code": "MEAL"
    },
    "tags": [
      {
        "descriptor": {
          "code": "selection"
        },
        "list": [
          {
            "descriptor": {
              "code": "seq"
            },
            "value": "2"
          },
          {
            "descriptor": {
              "code": "mandatory_selection"
            },
            "value": "true"
          },
          {
            "descriptor": {
              "code": "min_selection"
            },
            "value": "1"
          },
          {
            "descriptor": {
              "code": "max_selection"
            },
            "value": "3"
          }
        ]
      }
    ]
  },
  {
    "id": "C21",
    "parent_category_id": "C2",
    "descriptor": {
      "name": "Breakfast",
      "code": "BREAKFAST"
    },
    "tags": [
      {
        "descriptor": {
          "code": "schedule"
        },
        "list": [
          {
            "descriptor": {
              "code": "start_time"
            },
            "value": "09:00"
          },
          {
            "descriptor": {
              "code": "end_time"
            },
            "value": "11:00"
          },
          {
            "descriptor": {
              "code": "frequency"
            },
            "value": "PT1H"
          },
          {
            "descriptor": {
              "code": "mandatory_selection"
            },
            "value": "true"
          }
        ]
      }
    ]
  },
  {
    "id": "C22",
    "parent_category_id": "C2",
    "descriptor": {
      "name": "Lunch",
      "code": "LUNCH"
    },
    "tags": [
      {
        "descriptor": {
          "code": "schedule"
        },
        "list": [
          {
            "descriptor": {
              "code": "start_time"
            },
            "value": "12:00"
          },
          {
            "descriptor": {
              "code": "end_time"
            },
            "value": "15:00"
          },
          {
            "descriptor": {
              "code": "frequency"
            },
            "value": "PT1H"
          },
          {
            "descriptor": {
              "code": "mandatory_selection"
            },
            "value": "true"
          }
        ]
      }
    ]
  },
  {
    "id": "C23",
    "parent_category_id": "C2",
    "descriptor": {
      "name": "Dinner",
      "code": "DINNER"
    },
    "tags": [
      {
        "descriptor": {
          "code": "schedule"
        },
        "list": [
          {
            "descriptor": {
              "code": "start_time"
            },
            "value": "18:00"
          },
          {
            "descriptor": {
              "code": "end_time"
            },
            "value": "22:00"
          },
          {
            "descriptor": {
              "code": "frequency"
            },
            "value": "PT1H"
          },
          {
            "descriptor": {
              "code": "mandatory_selection"
            },
            "value": "true"
          }
        ]
      }
    ]
  },
  {
    "id": "C3",
    "descriptor": {
      "name": "Dishes",
      "code": "CUISINES"
    },
    "tags": [
      {
        "descriptor": {
          "code": "selection"
        },
        "list": [
          {
            "descriptor": {
              "code": "mandatory_selection"
            },
            "value": "true"
          },
          {
            "descriptor": {
              "code": "min_selection"
            },
            "value": "2"
          },
          {
            "descriptor": {
              "code": "max_selection"
            },
            "value": "12"
          },
          {
            "descriptor": {
              "code": "seq"
            },
            "value": "3"
          }
        ]
      }
    ]
  }
]