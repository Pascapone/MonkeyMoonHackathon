export const loadUserNotifications = async (Moralis, account) =>{
  const user = Moralis.User.current()
  
  console.log("Notifications")
  console.log(user)

  const telegramUserQuery = new Moralis.Query("telegramUser")
  telegramUserQuery.equalTo("ethAddress", account)
  const telegramUsers = await telegramUserQuery.find()

  console.log("Eth Address", account)
  console.log(telegramUsers)

  const userNotificationQuery = new Moralis.Query("notification")
  userNotificationQuery.equalTo("user", user)

  

  const queryArray = []
  for (let i = 0; i < telegramUsers.length; i++) {
    const telegramNotificationQuery = new Moralis.Query("notification")
    telegramNotificationQuery.equalTo("telegramUser", telegramUsers[i])    
    queryArray.push(telegramNotificationQuery)
  }   

  const mainQuery = Moralis.Query.or(userNotificationQuery, ...queryArray)

  mainQuery.include("signMessage")
  mainQuery.include("telegramUser")
  
  const notifications = await mainQuery.find()

  console.log(notifications)

  return notifications
}

export const getWhitelistStatus = async (Moralis) => {
  const user = Moralis.User.current()
  const telegramUserQuery = new Moralis.Query("telegramUser")
  telegramUserQuery.equalTo("user", user)
  const telegramUser = await telegramUserQuery.first()

  if(telegramUser){  
    return true
  }
  return false
}

export const getClaimScore = async (Moralis) => {
  const score = await Moralis.Cloud.run("getClaimScore")
  return score
}

export const removeOtherTelegramLinks = async (Moralis, telegramUser, account, user) => {
  const query = new Moralis.Query("telegramUser")
  query.equalTo("ethAddress", account)
  const telegramUsers = await query.find()

  console.log(account)

  console.log("TELEGRAM USERS")
  console.log(telegramUsers)
  telegramUsers.forEach((object) => {
    if(object.get('user')){
      console.log("This is the real user")      
    }
    else{
      object.unset("ethAddress")
      object.save()
      console.log("Delete")
    }    
  })
}