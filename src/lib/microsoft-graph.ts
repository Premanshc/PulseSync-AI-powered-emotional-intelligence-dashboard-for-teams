import { Client } from '@microsoft/microsoft-graph-client'
import { AuthenticationResult } from '@azure/msal-node'

export function getGraphClient(accessToken: string) {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken)
    }
  })
}

export async function getTeamChats(graphClient: Client, teamId: string) {
  try {
    const chats = await graphClient
      .api(`/teams/${teamId}/channels`)
      .get()
    
    return chats.value || []
  } catch (error) {
    console.error('Error fetching team chats:', error)
    return []
  }
}

export async function getChannelMessages(graphClient: Client, teamId: string, channelId: string) {
  try {
    const messages = await graphClient
      .api(`/teams/${teamId}/channels/${channelId}/messages`)
      .top(50) // Get last 50 messages
      .orderby('createdDateTime desc')
      .get()
    
    return messages.value || []
  } catch (error) {
    console.error('Error fetching channel messages:', error)
    return []
  }
}

export async function getUserProfile(graphClient: Client) {
  try {
    const profile = await graphClient.api('/me').get()
    return profile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export async function getUserTeams(graphClient: Client) {
  try {
    const teams = await graphClient.api('/me/joinedTeams').get()
    return teams.value || []
  } catch (error) {
    console.error('Error fetching user teams:', error)
    return []
  }
}
