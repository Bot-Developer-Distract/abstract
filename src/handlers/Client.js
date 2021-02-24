// Classe du client

const { connect } = require("mongoose");
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const chalk = require("chalk");

class Abstract extends Client {

    /**
     * 
     *      Bot Abstract de Squance#3682
     *          Si vous avez des questions, posez-les ici: https://discord.gg/vMSEnQzhaB
     * 
     **/ 

    constructor(options) {
        super(options);
        this.config = require("../../config.json");
        this.commands = new Collection();
        this.categories = readdirSync("./src/commands");
        this.ownerID = "808148589385351170";
        this.links = {
            invite: "https://bit.ly/2NXOLdZ",
            documentation: "https://squance.gitbook.io/abstract/",
            github: "https://github.com/Wuzax/abstract/",
            support: "https://discord.gg/srDMc7XBbM"
        };
        this.privateGuild = "810483126556033024";
        this.privateChannels = {      // privateChannels sont sur le serveur privé, aka le serveur de logs
            errors: "813825357051854849",
            logs: "813825357051854849",
            add: "813823564884606996",
            remove: "813823564884606996"
        };
        this.colors = {
            violet: "7289DA",
            burple: "7289DA",
            rouge: "F04747",
            vert: "43B581",
            noir: "000000",
            jaune: "ffe45d",
            gris: "99AAB5",
            discordColor: "303136",
        };
        this.emotes = {
            nope: "<:error:776811164747038730>",
            yup: "<:sucess:776811167804030976>",
            online: "<:online:760805198477131778>",
            offline: "<:offline:760805198171602944>",
            redSmallSquare: "<:dnd:760805197130760203>",
            greenSmallSquare: "<:online:760805198477131778>",
            greenArrow: "<:sucess:776811167804030976>",
            channelNotFound: "<:error:776811164747038730>",
            role: "#️⃣",
            file: "📁"
        };
    };

    // fonction qui permet de me prévenir des erreurs
    async error(message, error) {
        const errorChannel = this.channels.resolve(this.privateChannels.errors);
        if (!errorChannel) return console.error(error);
        message.channel.send("Une erreur est survenue, apprenez-en davantage ici : <" + this.links.support + ">").catch(() => {});
        let invite = null;
        if (message.guild.channels.cache.size > 0) {
            invite = await message.guild.channels.cache.random().createInvite(
                {
                    maxAge: 86400,
                    maxUses: 100
                }
            ).catch(() => {});
        };

        errorChannel.send(`<@!${this.ownerID}>`, {
            embed: {
                color: this.colors.discordColor,
                description: `**Nouvelle erreur**
                \`\`\`Utilisateur : ${message.author.tag}
                ID : ${message.author.id}
                Serveur : ${message.guild.name} (${message.guild.id})
                Invitation : ${invite ? invite : "aucune"}
                \`\`\`
                **Erreur**
                \`\`\`diff
                - ${error}
                \`\`\``
            }
        });
    };

    // pareil que la fonction précédente à la différence que celle-ci me prévient des erreurs des events par exemple
    async error2(error) {
        const errorChannel = this.channels.resolve(this.privateChannels.errors);
        errorChannel.send(`<@!${this.ownerID}>`, {
            embed: {
                color: this.colors.discordColor,
                description: `**Erreur**\n\`\`\`diff\n- ${error}\n\`\`\``
            }
        });
    };
    
    // fonction qui génère une couleur aléatoire parmi celles déjà proposées, oui je suis un flemmard
    color() {
        const colors = [
            "ff5f5f",
            "ffa55f",
            "ffd05f",
            "feff5f",
            "c5ff5f",
            "7fff5f",
            "5fff80",
            "5fffb0",
            "5fffdc",
            "5fe0ff",
            "5fa3ff",
            "5f6bff",
            "ab5fff",
            "e85fff",
            "ff5fc8",
            "ff5f8b",
            "ff5f62",
            "ff9191",
            "ffbb91",
            "ffe291",
            "efff91",
            "c8ff91",
            "98ff91",
            "91ffc6",
            "91ffff",
            "91bdff",
            "c591ff",
            "ff91cd"
        ];
        const randomColor = colors[Math.floor(Math.random()*colors.length)];
        return randomColor;
    };

    // fonction qui log juste certaines choses
    async log(message) {
        const logChannel = await this.channels.fetch(this.privateChannels.logs);
        logChannel.send(
            {
                embed: {
                    color: this.colors.discordColor,
                    description: message
                }
            }
        );
    };

    // fonction pour se connecter à la base de donnnées MongoDB, rappel: toute la base de donénes va être modifiée
    connectToDatabase() {
        connect(this.config.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(function() {
            console.log(chalk.green("Connecté à la base de données !"));
        }).catch(function(error) {
            console.error(chalk.red(error));
        });
    };

    // fonction pour supprimer un embed du bot avec une réaction
    async deleteThis(message, botMessage)  {
        botMessage.react("🇽").then(async function() {
            const filter = (reaction, user) => {
                return reaction.emoji.name === "🇽" && user.id === message.author.id;
            };
            const collector = botMessage.createReactionCollector(filter, {
                time: 60000,
                max: 1
            });
            collector.on("collect", function() {
                botMessage.delete().catch(() => {});
            });
            collector.on("end", function() {
                botMessage.reactions.resolve("🇽").users.remove(botMessage.author.id).catch(() => {});
            });
        });
    };

};

module.exports = Abstract;
