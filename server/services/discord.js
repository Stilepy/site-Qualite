const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config/discord');

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN);

module.exports = {
  // Adicionar bot a um servidor
  addBotToGuild: async (guildId, userId) => {
    try {
      // Verificar se o usuário tem permissões no servidor
      const member = await rest.get(
        Routes.guildMember(guildId, userId)
      );
      
      // TODO: Verificar permissões
      
      // Ativar bot no servidor
      // TODO: Implementar lógica específica para seu bot
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar bot ao servidor:', error);
      return { success: false, error: error.message };
    }
  },
  
  sendUserMessage: async (userId, message) => {
    try {
      const channel = await rest.post(
        Routes.userChannels(),
        { body: { recipient_id: userId } }
      );
      
      await rest.post(
        Routes.channelMessages(channel.id),
        { body: { content: message } }
      );
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return { success: false, error: error.message };
    }
  }
};