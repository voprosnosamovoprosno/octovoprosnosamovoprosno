/**
 * This is the main server script that provides the API endpoints
 *
 * Uses sqlite.js to connect to db
 */
const path = require("path");

const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false
});

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});
  
fastify.register(require("@fastify/formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

const db = require("./sqlite.js");
const errorMessage =
  "Whoops! Error connecting to the database–please try again!";

// OnRoute hook to list endpoints
const routes = { endpoints: [] };
fastify.addHook("onRoute", routeOptions => {
  routes.endpoints.push(routeOptions.method + " " + routeOptions.path);
});

// Just send some info at the home route
fastify.get("/", (request, reply) => {
 /* const data = {
    title: "Hello SQLite (blank)",
    intro: "This is a database-backed API with the following endpoints",
    routes: routes.endpoints
  };
  reply.status(200).send(data);
*/
  return reply.view('voprosnosamovoprosno.html');
});

function randomInteger(min, max) {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

fastify.post("/", async (request, reply) => {
  console.log(request.body);
  if(request.body=='?вопросносамовопросно?')
    {let vssgml = await db.getMessages();
     console.log('?vssmsgsqnt'+vssgml.length+'?');
    
    if(vssgml.length>812)
       {for(let vssj=0;vssj<vssgml.length-12;vssj++)
         {vssdml=await db.deleteMessage(vssgml[vssj].id);
          console.log('?vssdelmesid'+vssgml[vssj].id+vssdml+'?');
         }
        vssgml = await db.getMessages();
        console.log('?vssmsgsqnt'+vssgml.length+'?'); 
       }
            
     let vssmsl=[];
     for(let vssi=0;vssi<vssgml.length;vssi++)
       {if(vssgml[vssi].message.substring(0,1)=='?')
         {vssmsl.push(vssgml[vssi].message);
         }else{vssdml=await db.deleteMessage(vssgml[vssi].id);
              console.log('?vssdelmesid'+vssgml[vssi].id+vssdml+'?');
              }      
       }        
   //console.log('?vssmessages?'+'\n'+vssmsl);
     let vssri=randomInteger(0,vssmsl.length-1);
     console.log('?vssrandom'+vssri+'?');
     return vssmsl[vssri];
    }
   else{let vssaml = await db.addMessage(request.body);
        console.log('?vssaddmessage'+vssaml+'?');
        return request.body;
       }
});

// Return the chat messages from the database helper script - no auth
fastify.get("/messages", async (request, reply) => {
  let data = {};
  data.chat = await db.getMessages();
  console.log(data.chat);
  if(!data.chat) data.error = errorMessage;
  const status = data.error ? 400 : 200;
  reply.status(status).send(data);
});

// Add new message (auth)
fastify.post("/message", async (request, reply) => {
  let data = {};
  const auth = authorized(request.headers.admin_key);
  if(!auth || !request.body || !request.body.message) data.success = false;
  else if(auth) data.success = await db.addMessage(request.body.message);
  const status = data.success ? 201 : auth ? 400 : 401;
  reply.status(status).send(data);
});

// Update text for an message (auth)
fastify.put("/message", async (request, reply) => { 
  let data = {};
  const auth = authorized(request.headers.admin_key);
  if(!auth || !request.body || !request.body.id || !request.body.message) data.success = false;
  else data.success = await db.updateMessage(request.body.id, request.body.message); 
  const status = data.success ? 201 : auth ? 400 : 401;
  reply.status(status).send(data);
});

// Delete a message (auth)
fastify.delete("/message", async (request, reply) => {
  let data = {};
  const auth = authorized(request.headers.admin_key);
  if(!auth || !request.query || !request.query.id) data.success = false;
  else data.success = await db.deleteMessage(request.query.id);
  const status = data.success ? 201 : auth ? 400 : 401;
  reply.status(status).send(data);
});

const vsskvn='vsskvv';
// Helper function to authenticate the user key
const authorized = key => {
  if (
    !key ||
    key < 1 ||
    !process.env.ADMIN_KEY ||
    key !== process.env.ADMIN_KEY
  )
    return false;
  else return true;
};

// Run the server and report out to the logs
fastify.listen({port:process.env.PORT, host:'0.0.0.0'}, function(err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`?vss${address}?`);
});