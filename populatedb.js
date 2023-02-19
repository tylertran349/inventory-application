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

var items = []
var categories = []
var iteminstances = []

function itemCreate(name, description, category, number_in_stock, launch_date) {
    itemdetail = { name: name, description: description, category: category, number_in_stock: number_in_stock, launch_date: launch_date };
    var item = new Item(itemdetail);
    
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
    categorydetail = { name: name, description: description }
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

function itemInstanceCreate(item, condition, price) {
    iteminstancedetail = { item: item, price: price };
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
            itemCreate('Ryzen 5800X3D', 'An 8-core Zen 3 processor.', 'Processors', 8, '2022-04-20', callback);
        },
        function(callback) {
            itemCreate('RTX 3080', 'A powerful 4K GPU', 'Video cards', 10, '2020-09-17', callback);
        }
    ], 
    cb);
}

function createCategories(cb) {
    async.parallel([
        function(callback) {
            categoryCreate('Processors', 'Processors/CPUs for your computer');
        },
        function(callback) {
            categoryCreate('VIdeo cards', 'Devices to output video to a monitor/screen');
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
        }
    ],
    cb);
}

async.series([
    createItems, createCategories, createItemInstances
],
function(err, results) {
    if(err) {
        console.log("Final error: " + err);
    } else {
        console.log("ItemInstances: " + iteminstances);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});