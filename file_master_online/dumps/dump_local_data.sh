#!/bin/bash
# Script to dump local db and media
# Mario Orlandi, 2015

LOCAL_DBNAME="alfamaster"
LOCAL_DBOWNER="postgres"
PREFIX=$(date +%Y-%m-%d_%H.%M.%S)_

# Prerequisites on MAC OS X:
# $ sudo port install coreutils
# to be used as follows:
# $ greadlink -f relative_path
# as readlink option -f is missing

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
SYNC_FOLDER="${SCRIPTPATH}/../dumps/localhost"
if hash greadlink 2>/dev/null; then
    SYNC_FOLDER=`greadlink -f $SYNC_FOLDER`
else
    SYNC_FOLDER=`readlink -f $SYNC_FOLDER`
fi

LOCAL_MEDIA_FOLDER="${SCRIPTPATH}/../public/media"
if hash greadlink 2>/dev/null; then
    LOCAL_MEDIA_FOLDER=`greadlink -f $LOCAL_MEDIA_FOLDER`
else
    LOCAL_MEDIA_FOLDER=`readlink -f $LOCAL_MEDIA_FOLDER`
fi

echo ''
echo 'LOCAL_DBNAME: '$LOCAL_DBNAME
echo 'LOCAL_DBOWNER: '$LOCAL_DBOWNER
echo 'SYNC_FOLDER: '$SYNC_FOLDER
echo 'LOCAL_MEDIA_FOLDER: '$LOCAL_MEDIA_FOLDER
echo ''

help() {
    echo 'Sample usage:'
    echo '    $ ./dump_local_data source'
    echo 'where:'
    echo '    source = media|db|all'
}

do_dump_db() {
    echo '*** dump local db '$LOCAL_DBNAME' ...'
    mkdir -p $SYNC_FOLDER

    DB_DUMP_FILENAME="${PREFIX}${LOCAL_DBNAME}.sql.gz"
    DB_DUMP_FILEPATH="${SYNC_FOLDER}/${DB_DUMP_FILENAME}"
    pg_dump $LOCAL_DBNAME | gzip > $DB_DUMP_FILEPATH
    echo '=========================================================================='
    ls -lh $DB_DUMP_FILEPATH
    echo '=========================================================================='
}

do_dump_media() {
    echo '*** dump local media ...'
    mkdir -p $SYNC_FOLDER

    MEDIA_DUMP_FILENAME="${PREFIX}${LOCAL_DBNAME}.media.tar.gz"
    cd "$LOCAL_MEDIA_FOLDER/../"
    echo "tar czf ${SYNC_FOLDER}/${MEDIA_DUMP_FILENAME} media"
    tar czf ${SYNC_FOLDER}/${MEDIA_DUMP_FILENAME} media

    cd $SCRIPTPATH
    echo '=========================================================================='
    COMMAND="ls -lh $SYNC_FOLDER/$MEDIA_DUMP_FILENAME"
    echo $COMMAND
    $COMMAND
    echo '=========================================================================='
}

if [ $# -ne 1 ]; then
    help
    exit
fi

source=$1
if [ "$source" == "db" ]; then
    do_dump_db
elif [ "$source" == "media" ]; then
    do_dump_media
elif [ "$source" == "all" ]; then
    do_dump_db
    do_dump_media
else
    help
fi
