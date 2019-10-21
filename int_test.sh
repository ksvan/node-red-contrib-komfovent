#! /bin/bash
export INTEGRATION="true"
export INTEGRATION_USER="user"
export INTEGRATION_IP="192.168.1.234"

echo "Enter password"
read pwd
export INTEGRATION_PWD="$pwd"

mocha test/integration/test*.js
