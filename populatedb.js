#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async');
var Item = require('./models/item');
var Category = require('./models/category');
var ItemInstance = require('./models/iteminstance');


const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const items = [];
const categories = [];
const iteminstances = [];

function itemCreate(name, description, category, launch_date, cb) {
    let itemdetail = { name: name, description: description, category: category, launch_date: launch_date };
    const item = new Item(itemdetail);
    
    item.save(function(err) {
        if(err) {
            cb(err, null);
            return;
        }
        console.log("New item: " + item);
        items.push(item);
        cb(null, item);
    });
}

function categoryCreate(name, description, cb) {
    let categorydetail = { name: name, description: description }
    var category = new Category(categorydetail);

    category.save(function(err) {
        if(err) {
            cb(err, null);
            return;
        }
        console.log("New category: " + category);
        categories.push(category);
        cb(null, category);
    })
}

function itemInstanceCreate(item, condition, price, cb) {
    let iteminstancedetail = { item: item, price: price };
    if(condition != false) iteminstancedetail.condition = condition;
    
    var iteminstance = new ItemInstance(iteminstancedetail);
    iteminstance.save(function(err) {
        if(err) {
            console.log("ERROR CREATING ItemInstance: " + iteminstance);
            cb(err, null);
            return;
        }
        console.log("New ItemInstance: " + iteminstance);
        iteminstances.push(iteminstance);
        cb(null, item);
    })
}

function createItems(cb) {
    async.parallel([
        function(callback) {
            itemCreate('Ryzen 5800X3D', 'An 8-core Zen 3 processor from AMD', categories[0], '2022-04-20', callback);
        },
        function(callback) {
            itemCreate('RTX 3080', 'A powerful 4K GPU from NVIDIA', categories[1], '2020-09-17', callback);
        },
        function(callback) {
            itemCreate('RX 6800XT', 'A powerful 4K GPU from AMD', categories[1], '2020-11-18', callback);
        },
        function(callback) {
            itemCreate('NZXT H510', 'A great value computer case from NZXT', categories[2], '2019-07-18', callback);
        }
    ], 
    cb);
}

function createCategories(cb) {
    async.parallel([
        function(callback) {
            categoryCreate('Processors', 'Processors/CPUs for your computer', callback);
        },
        function(callback) {
            categoryCreate('Video cards', 'Devices to output video to a monitor/screen', callback);
        },
        function(callback) {
            categoryCreate('Cases', 'Housing for all the components in a computer', callback)
        }
    ],
    cb);
}

function createItemInstances(cb) {
    async.parallel([
        function(callback) {
            itemInstanceCreate(items[0], 'New', 329.99, callback);
        },
        function(callback) {
            itemInstanceCreate(items[1], 'New', 699.99, callback);
        },
        function(callback) {
            itemInstanceCreate(items[1], 'New', 699.99, callback);
        },
        function(callback) {
            itemInstanceCreate(items[1], 'Used', 499.99, callback);
        },
        function(callback) {
            itemInstanceCreate(items[2], 'New', 699.99, callback);
        },
        function(callback) {
            itemInstanceCreate(items[3], 'New', 99.99, callback);
        },
        function(callback) {
            itemInstanceCreate(items[3], 'Refurbished', 69.99, callback);
        },

    ],
    cb);
}

async.series([
    createCategories,
    createItems,
    createItemInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    }
    else {
        console.log('BOOKInstances: ' + iteminstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
