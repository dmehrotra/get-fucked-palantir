var fs = require('fs')
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    chrome = require('selenium-webdriver/chrome');


var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get('http://www.linkedin.com');
driver.findElement(By.name('session_key')).sendKeys('dhruv.mehrotra3@gmail.com');
driver.findElement(By.name('session_password')).sendKeys('');
driver.findElement(By.id('login-submit')).click();
driver.wait(until.elementLocated(By.id('messaging-nav-item')));
driver.findElement(By.id('messaging-nav-item')).click();
driver.wait(until.elementLocated(By.className('msg-s-message-listitem__body')))
driver.findElement(By.className('msg-s-message-listitem__body')).getText().then(function(txt){
	var emails = extractEmails(txt)
	if (emails == "undefined"){
		driver.quit()
	}else{
		checkLastMessage(emails)
	}
	

})

function extractEmails (text){
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) || "undefined";
}
function checkLastMessage(email){
	fs.readFile('./emails.txt', 'utf8', function (err, data) {
        if (err) throw err;
        if (data !=  email.toString()){
        	fs.writeFile("./emails.txt",  email.toString(), function(err) {
        		console.log('new email')
        		chooseCandidate(email,function(candidate,email){
        			emailRecruiter(candidate,email)	
        		})
        	})
        }else{
        	driver.quit()
        }
    })
}
function emailRecruiter(candidate,email){

    var email_txt = generateBullshit(candidate)
    
    driver.get('https://mail.google.com')
	driver.findElement(By.name('Email')).sendKeys('recruitment.bettertech@gmail.com');
	driver.findElement(By.name('signIn')).click();
	driver.manage().timeouts().implicitlyWait(5000);
    driver.findElement(By.name('Passwd')).sendKeys('');
	driver.findElement(By.id('signIn')).click();
	driver.manage().timeouts().implicitlyWait(5000);
	driver.findElement(By.className('z0')).click();
	driver.manage().timeouts().implicitlyWait(5000);
	driver.findElement(By.name('to')).sendKeys(email[0]);
	driver.findElement(By.name('subjectbox')).sendKeys(candidate.name + ": Qualified Candidate from BetterTech");
    driver.findElement(By.className('Am Al')).sendKeys(email_txt);

 
    
}
function generateBullshit(candidate){
	var base = "Hello, my name is Drew McDuggins and I am emailing you on behalf of BetterTech.  We are a non-profit that seeks to match qualified Palantir employees with new opportunities that don't involve tacit complicity in world-wide acts of violence.  We believe we have found a match for a recent opportunity at your company. "+ candidate.name + " is a graduate of " + candidate.university + " who is currently a "+ candidate.job +". Our candidate is a very meticulous engineer who takes great pride in his work. "+ candidate.name + " ensures that the code he writes meets the highest level of quality and readability, and is testable. You can trust their output with minimal oversight. "
	var bullshit_three = "Our Candidate helped migrate ishares-tools websites from JBoss 6 to Apache Tomcat 7 while updating legacy code and did part time research for the Sociology department on factors influencing the careers of Chinese government officials (data collection and literature review)."
	var bullshit_four = "Our candidate spent time migrating and refactoring logical spreadsheets, and creating a front-end web application enabling faculty office assignments."
	var bullshit_five = "Our Candidate managed an amazing team, dealing with a global datacenter presence and the occasional migrations, budget and capacity planning, Linux and BSD hackery, LAMP stacks, backend architecture and troubleshooting. Basically, everything thats required to keep the backend running."
	var bullshit_six = "Our Candidate worked Developing a Spring Security based Authentication solution for Palantir products supporting SAML, in-memory, LDAP providers. The roles and responsibilities involved automating the new test cases, fixing the issues with previously automated cases. The automation was done in HP QTP 9."
	var bullshit = [bullshit_three,bullshit_four,bullshit_five,bullshit_six]
	var end_base =  candidate.name + " enjoys all aspects of the software design process including understanding requirements, initial design, implementation and testing, and managing software as it evolves.  Please reach out to "+ candidate.name + " at "+ candidate.link + " .  Thanks"

	var txt = base + bullshit[Math.floor(Math.random() * bullshit.length)] + " " + end_base
	return txt
}
function chooseCandidate(email,callback){
	var candidate = {}
	grabRandom(function(emp){
		driver.get(emp)
		driver.wait(until.elementLocated(By.className('pv-entity__school-name')));
		driver.findElement(By.className('pv-entity__school-name')).getText().then(function(school){
			candidate.university = school
            candidate.link = emp;
			driver.findElement(By.className('pv-entity__degree-name')).getText().then(function(degree){
				candidate.degree = degree
				driver.findElement(By.className('pv-top-card-section__headline')).getText().then(function(title){
					candidate.job = title
				    driver.findElement(By.className('pv-top-card-section__name')).getText().then(function(name){
					    candidate.name = name;
                        callback(candidate,email)
                    });
				})
			})
		}) 
	})

}

function grabRandom(callback){
	var ar;
	fs.readFile('./employee.txt', 'utf8', function (err, data) {
		ar = data.split('\n')[Math.floor(Math.random() * data.split('\n').length)];
		callback(ar);
	})
	
}
