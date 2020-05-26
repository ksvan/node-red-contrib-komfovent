#! /bin/bash
export INTEGRATION="true"
export INTEGRATION_USER="user"
export INTEGRATION_IP="192.168.1.234"

if [[ -z "$INTEGRATION_PWD" ]]
then
    echo "Password is set"
else
    echo "Enter password"
    read pwd
    export INTEGRATION_PWD="$pwd"
fi

mocha test/integration/test*.js
