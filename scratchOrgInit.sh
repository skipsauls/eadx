## Default org duration to 1 day if argument not set
ORG_DURATION=1
TEMPLATE_API_NAME=wave_de__Mortgage_Calculator

# override org duration if argument exists
if [ "$#" -eq  "0" ]
then
    echo "[INFO] No arguments specified"
else
    ORG_DURATION=$1
fi

# create scratch org
echo "INFO] Creating Scratch Org with Duration: $ORG_DURATION Day(s)..."
sfdx force:org:create -f config/project-scratch-def.json -s -d $ORG_DURATION -w 60

# push the contents of this repo into the scratch org
echo "[INFO] Pushing source..."
sfdx force:source:push -f

# create an app using the auto installer
echo "[INFO] Creating the Master App"
sfdx force:data:record:create -s WaveAutoInstallRequest -v "RequestStatus='Enqueued' RequestType='WaveAppCreate' TemplateApiName='$TEMPLATE_API_NAME'"

# view the finished app
sfdx analytics:app:list

#open the org
sfdx force:org:open
