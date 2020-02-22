const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const axios = require('axios');


(async function () {
    const ans = await inquirer.prompt([
        {
            message: "What is your favorite color?",
            name: 'color'
        },
        {
            message: "what is your github profile?",
            name: 'user'
        }
    ]);

    //    const user = ans.user
    const response = await axios.get(`https://api.github.com/users/${ans.user}/repos`);
    const response2 = await axios.get(`https://api.github.com/users/${ans.user}`);
    const response3 = await axios.get(`https://api.github.com/users/${ans.user}/starred`)
    const response4 = await axios.get(`https://api.github.com/users/${ans.user}/followers`)
    const response5 = await axios.get(`https://api.github.com/users/${ans.user}/following`)
    
    console.log('Done')
    const repoURLs = response.data.map((repoObject) => {
        return `<p>${repoObject.html_url}</p>`;
    })
    //    const userName = response2
    //    console.log(repoURLs.length)

    try {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(`
        <style>
        html{
            -webkit-print-color-adjust: exact;
            color: whitesmoke;
            font-family: Arial, Helvetica, sans-serif;
            font-size: large;
        }    
        
        

        img{
            width: 75px;
            height: 75px;
            margin-left: 1em;
            border-radius: 50%;
        }

        .header{
            position: fixed;
            background-color: orange;
            width: 100%;
            height: 150px;
        } 
        
        
        
        .card{
            position: relative;
            display: flex;
            justify-content: center;
            background-color: ${ans.color};
            margin:  75px auto 25px;
            width: 75%; 
            height: 100px;
            padding: 10px;
            border-radius: 20px;
        }
        
        .card2{
            position: relative;
            display: flex;
            justify-content: center;
            background-color: ${ans.color};
            margin:  auto; 
            width: 75%; 
            height: 100px;
            padding: 10px;
            border-radius: 20px;
        }

        .footer{
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 40px;
            background-color: #666666;
            margin-top: auto;
        
        }
        
        </style>
        <div class="header"></div>
            <h1>Hello</h1>
            
        <div class="wrapper">
            <div class="card">
                <h2>${response2.data.name}</h2>
                <img src="${response2.data.avatar_url}">
            </div>
            <br>
            <div class="card2">
                <h2>Bio:</h2>
                
                <p>${response2.data.bio}</p>
            </div>
            <br> 
            <div class="card2">
                <h2>Links:</h2>
                <ul>
                    <li><a href="https://www.google.com/maps/place/${response2.data.location}">Location</a></li>
                    <li><a href="${response2.data.html_url}">GitHub Profile</a></li>
                    <li><a href="${response2.data.blog}">Blog</a></li>
                </ul>
            </div>
            <br>
    
            <div class="card2">
                <h2>Number of GitHub Repositories: ${repoURLs.length}</h2>
                
                
            </div>
            <br>
            <div class="card2">
                <ul>
                    <li>Number of GitHub stars: ${response3.data.length}</li>
                    <li>Number of GitHub followers: ${response4.data.length}</li>
                    <li>Number of GitHub users following: ${response5.data.length}</li>
                </ul>
            </div>
        </div>
            
            
            <div class="footer"></div>
  
        `);
        await page.emulateMedia('screen');
        await page.pdf({
            path: 'mypdf.pdf',
            format: 'A4',
            printBackround: true
        });


        await browser.close();
        process.exit();


    } catch (e) {
        console.log('our error', e);
    }
})();



// lupemls


















