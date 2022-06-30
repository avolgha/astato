# Astato

A simple cli tool for generating projects

## » Name

The name comes from the 85. element of the periodic system called `Astatine`. The name used here is the spanish version of the element because it sounded cooler than the english word.

## » How to use

There are _two_ different things you can do with this tool:

1. create complete projects
2. create code samples

### » How to create projects

Just run `astato` from the command line. Then there should be a guide you can follow.  
If you have any questions about the behaviour, feel free to open an issue here.

### » How to create code samples

Generating code samples is a bit more complex. But the only thing you have to now is this theme: `astato add <sample>`.  
At `<sample>` you have to add the name of the sample you want to generate. Currently, there is no way to list them all without looking into the source code of the project.  
In the `src/addTemplate` directory, you can see all the templates you could use.  
Just add one of them and you are ready to go :)

## » Installation

To install the tool, you have to install it.

> **Warning**: The tool is made for `yarnpkg`, not for `npm`, so there _are_ errors you will find when executing the tool with npm. For the reason that I use yarn, I wont change it without any pull request from outside.

```shell
# The preffered way:
$ yarn global add git+https://github.com/avolgha/astato.git

# Via NPM:
$ npm i -g git+https://github.com/avolgha/astato.git
```

Now you should be able to use the command `astato` anywhere in the console. If that isn't the case, please open an issue so that I can fix that probleme asap.

## » Developer Instructions

_Tip: I highly recommend using yarn_.

1. First you need to clone the repositiory: `git clone https://github.com/avolgha/astato.git`
2. Then you need to install all the dependencies: `yarn`
3. Furhtermore, I recommend checking if the code works by running: `yarn compile`

Happy coding!

## » Bugs, Problems, Ideas and so on

If you find bugs or you have problems or ideas, you're welcome to open an issue or even a pull request (if you found and fixed the problem) to let me know what is/was wrong and how I can help you and all people who have the same problem or will have the same problem in the future.
