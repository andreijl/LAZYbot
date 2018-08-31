const Parse = require("../util/parse.js");
const Embed = require("../util/embed.js");
const DataManager = require("../util/datamanager.js");
const commands = DataManager.getFile("./src/data/commands.json");

class Help extends Parse {
  constructor(message) {
    super(message);
  }

  run(args) {
    for (let i = 0; i < commands.length; i++) {
      for (let j = 0; j < commands[i].aliases.length; j++) {
        if (commands[i].aliases[j].toLowerCase() === args[0].toLowerCase() || this.server.prefixes[commands[i].prefix] + commands[i].aliases[j].toLowerCase() === args[0].toLowerCase()) {
          this.cmdInfo = commands[i];
          break;
        }
      }
    };
    if (!this.cmdInfo) return this.Output.onError("Couldn't find that command. Please verify that that command exists.\nNote: some commands get removed for stability issues.");
    let embed = {};
    let properties = ["title", "color", "thumbnail", "description", "fields", "footer"];
    for (let property of properties)
      embed[property] = this[property];
    this.Output.sender(embed);
  }

  get color() {
    return 11126483
  }

  get title() {
    return "`" + this.prefix + this.cmdInfo.aliases.join("`**/**`" + this.prefix) + "`";
  }

  get description() {
    return this.cmdInfo.description
      .replace(/\${([a-z]+)}/gi, value => this.server.prefixes[value.match(/[a-z]+/i)])
    //.replace(/\${generic}/gi, this.server.prefixes.generic)
    //.replace(/\${nadeko}/gi, this.server.prefixes.nadeko);
  }

  get prefix() {
    return this.server.prefixes[this.cmdInfo.prefix];
  }

  get fields() {
    let fields = [];
    fields = Embed.fielder(fields,
      "Usage",
      this.usage,
      false
    );
    if (this.cmdInfo.requires && this.requires.trim()) fields = Embed.fielder(fields,
      "Requirements",
      this.requires,
      false
    );
    return fields;
  }

  get requires() {
    if (this._requires) return this._requires;
    let array = [];
    for (let [type, _value] of Object.entries(this.cmdInfo.requires)) { //[channel: "spam"]
      let value = !Array.isArray(_value) ? [_value] : _value; //if it's not array (i.e. multiple possible satisfactory conditions)
      value = value.map((item) => {
        let _item = this.map(type, item);
        if (_item === null || _item === "") return item;
        if (_item === undefined) return _item;
        return _item;
      });
      if (value.includes("undefined")) continue;
      array.push([
        "• " + type.toProperCase(),
        value.join(" or ")
      ])
    };
    this._requires = Embed.getFields(array);
    return this._requires;
  }

  get footer() {
    return Embed.footer("Module: " + this.cmdInfo.module);
  }

  get usage() {
    return "`" + this.prefix + this.cmdInfo.usage.join("`\n`" + this.prefix) + "`";
  }

  map(type, item) { //basically a custom map function customisable to the type
    switch (type) {
      case "house":
        return "[House Discord Server](https://discord.gg/RhWgzcC) command only.";
      case "user":
        if (item === "owner") return "**Bot owner only**. [Active developers](https://github.com/theLAZYmd/LAZYbot/graphs/contributors).";
        let user = this.Search.users.get(item);
        if (user) return user;
        return "";
      case "state":
        return item;
      case "channels":
        return this.Search.channels.get(this.server.channels[item]);
      case "role":
        return this.Search.roles.get(this.server.roles[item]);
      case "bot":
        return undefined;
      case "response":
        return undefined;
      case "args":
        let string = "";
        if (item.hasOwnProperty("length")) {
          if (!Array.isArray(item.length)) item.length = [item.length];
          string += "`" + item.length.join("` or `") + "` arguments"
        };
        return string;
      default:
        return undefined;
    }
  }
}

module.exports = Help;

String.prototype.toProperCase = function () {
  let words = this.split(/ +/g);
  let newArray = [];
  for (let j = 0; j < words.length; j++) {
    newArray[j] = words[j][0].toUpperCase() + words[j].slice(1, words[j].length).toLowerCase();
  }
  let newString = newArray.join(" ");
  return newString;
}