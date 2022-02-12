# Commanders Innerworkings

So i recently made a boilerplate for Discord JS 12 called [commander](https://github.com/tahlilma/commander). It's bascically a small project I decided to work on for Nehan since he had a pretty shitty command handler *(the same does not hold true anymore)* on a bot he was working on. Now I do know for a fact that Discord JS 12 is deprecated and shit but still, theres some smart code *(in my eyes)* behind my boilerplate. 

Im making this post to basically cope with Nehan not using my boilerplate and deciding to essentially steal my features and add it to his own bot. I really shouldnt be one to talk since I steal his shit from time to time too.

## The Idea
The basic idea for this project was to create a boilerplate which will automatically add new commands by checking a single directory. So like all you need to create a new command is to just add a new file in a folder and add some meta data to it. 

The main thing that the command handler uses is what the JS plebs call uhh... Ok I forgot the name. But its basically a way of accessing a object using the name of its key. So an example would be.

```
const someObj = {
  balls: true
}

someObj['balls'] // true
```

My **ENTIRE** command handler is based upon this single theory. And if you think about it at the end of the day the implementation is fairly easy.

## The Execution 
Essentially I created a commands directory and created some files in that folder. My main goal was to automatically have each files name be the trigger for the command. So like if a file was called `ping.js` the word `ping` would be registered as a valid command to the bot. Now we did support for alt commands by which I mean just short form of the parent commands which the users can use when they dont wanna type out the whole large command. So the alt for `ping` would just be `p`. Ill talk about alt commands and how I did that shit later. First we gotta talk about the actual parent command.

Basically I made this schema which all the files in the commands directory needs to follow. Then all the files in the command directory just export an object following the schema i mentioned above. The schema goes like this.

```
{
  name: 'ping' // Name of the command (same as file name)
  alt: 'p', // Short form of the command which will also trigger the command
  desc: 'Replies with hi', // The info that'll be shown in help menu
  handler: (message) => console.log(message) // The actual function that runs when command is triggered
}
```

So after that I just wrote a function which takes every single file in the commands directory, imports the objects from the files and compiles them into a single object. So like if i had 2 commands the final single object would be 

```
{
  ping: {
    name: 'ping'
    alt: 'p', 
    desc: 'Replies with hi', 
    handler: (message) => console.log(message) 
  },
  help: {
    name: 'help',
    alt: 'h',
    desc: 'Shows the help menu',
    handler: (message) => console.log(message)
  }
}
```

As you can see we can now actually call the handler using the method of object accessing i mentioned earlier. So now for example we do some hardcore string manipulation and we figure out what command the user used after the prefix. We can just call the function like so

```
const commandName = 'help'; // This is just an example
commandIndex[commandName].handler(message)
```

We also pass in the message object cause like we need access to the message that triggered the command in the first place.

Now I did mention the matter of alt commands and tbh it literally works in the same way just like instead of using the full name as the key it uses the alt as the key. So the object I showed a few mins earlier would become 

```
{
  p: {
    name: 'ping'
    alt: 'p', 
    desc: 'Replies with hi', 
    handler: (message) => console.log(message) 
  },
  h: {
    name: 'help',
    alt: 'h',
    desc: 'Shows the help menu',
    handler: (message) => console.log(message)
  }
}
```

Therefore you can simply just do some *hardcore* string manipulation and again call the handler by acessing the object.

**BUT** You may wonder, *How does this dumbass know when to call the alt or when to call the full command ??*. 

Thats the thing.

***You dont.***.

What I did is just check whether the command returns undefined when I access the object using the message which is sent by the user.
Ill just show you the code cause im too lazy to explain it.

```
const commandIndex = metaGenerator();
if (!commandIndex[command]) {
  const altIndex = metaGenerator({ type: "alt" });
  if (!altIndex[command]) {
    message.channel.send(
      new ErrorEmbed(
        "Command Not Found",
        "I don't think I have that command chief."
      )
    );
    return;
  } else {
    altIndex[command].handler(message);
  }
} else {
  commandIndex[command].handler(message);
}
```

That code block should explain everything. If it dosent tho, thats your problem.

## The Shitty Parts
Well the command handler is basically perfect other than the fact that it does start to chug when there are more than a few commands since it has to loop through an entire directory and import data from each and every file. Other than that this command handler's basically godsend.

## Conclusion
Do not use the command handler I made. It has bad code involved in it and the lib version im using has lost support from the Discord JS team. You would be better off using Discord JS 13. 

I do plan on making a command handler for Discord JS 13 but first I gotta learn all the new shit.

Anyways, this post has been a pain in the ass to write and if you read this far I am sorry for making you lose some brain cells. Im gonna stop writing now. Ill see you dumbasses in the next post.

Goodbye.

*(PS: ignore any grammatical or spelling mistakes, I was too lazy to spellcheck.)*