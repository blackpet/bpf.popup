# bpf.popup


@author blackpet

@date 2020.5

[![Run on Repl.it](https://repl.it/badge/github/blackpet/bpf.popup)](https://repl.it/github/blackpet/bpf.popup)

## Documentation

### Options

#### Props

```javascript
bpf.popup.create('POPUP_NAME', options);
```


| option    | type         | value                                             | (default) | description               |
|-----------|--------------|---------------------------------------------------|-----------|---------------------------|
| debug     | boolean      | true/false                                        | FALSE     | console log in actions    |
| url       | string       | url string                                        | -         | * url, template, selector |
| template  | string       | template (markup) string                          | -         | * url, template, selector |
| selector  | css selector | css selector string                               | -         | * url, template, selector |
| title     | string       | title string                                      | -         | * url, template, selector |
| width     | number       | size of popup (px)                                | -         |                           |
| modal     | boolean      | wrapping body to backdrop                         | FALSE     |                           |
| closeable | boolean      | Whether to use the close button                   | TRUE      |                           |
| className | string       | class string (multiple values separated by space) | -         |                           |
| buttons   | string array | optional ['ok', 'cancel']                         | -         | * ok(), cancel()          |
| data      | object       | passing value to popup instance                   | -         |                           |
| callback  | function     | callback function for popup instance              | -         |                           |



#### Events


| event    | description                                                        |
|----------|--------------------------------------------------------------------|
| callback | invoked when the callback function is called in the popup instance |
| ready    | invoked after popup instance loaded                                |
| close    | invoked before popup instance disposed                             |
| ok       | overwrite [ok] button label and function                           |
| cancel   | overwrite [cancel] button label and function                       |


### Instance Methods


| methods  | description                                     |
|----------|-------------------------------------------------|
| close    | close popup instance                            |
| callback | invoke callback function passed by config props |
| submit   | submit popup instantly using AJAX               |
| ok       | overwrite [ok] button label and function        |
| cancel   | overwrite [cancel] button label and function    |


#### .data Instance Storage

- private storage inside of poppy instance
- key/value object


| methods  | description                   |
|----------|-------------------------------|
| push     | [value for array]             |
| remove   | [value for array]             |
| indexOf  | [value for array]             |
| put      | [value for object]            |
| get      | get value of {key} argument   |
| delete   | delete key of storage         |
| _default | {data} passed by config props |
