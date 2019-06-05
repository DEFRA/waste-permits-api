# Waste Permits API Service

[![Build Status](https://travis-ci.org/DEFRA/waste-permits-api.svg?branch=master)](https://travis-ci.org/DEFRA/waste-permits-api)
[![Greenkeeper badge](https://badges.greenkeeper.io/DEFRA/waste-permits-api.svg)](https://greenkeeper.io/)

## Prerequisites

Please make sure the following are installed:

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js v10/Dubnuim](https://nodejs.org/en/) recommend
  installing nvm and using `nvm install --lts`
- [StandardJS](https://standardjs.com/) using `npm install -g standard`

Check that your environment is running the correct versions of `node` and `npm`:
```bash
$ npm --version
6.9.0
$ node --version
v10.15.3
```

## Installation

Clone the repository and install its package
dependencies:

```bash
git clone https://github.com/DEFRA/waste-permits-api.git && cd waste-permits-api
npm install
```

# Setting up .env

Copy the `.env.example` file to `.env` and set it up for your
environment

```bash
cp .env.example .env
```