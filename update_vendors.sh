#!/bin/bash 



function fetch_lib {
	original_dir=`pwd`
	
	dir=$1
	git_url=$2
	
	if [ ! -e lib/$dir ]; then
		echo "mkdir"
		mkdir lib/$dir
	fi
	echo "2"
	cd lib/$dir
	echo "3"
	git fetch $git_url
	
	echo "4"
	cd $original_dir
}

##############
## Code Mirror
##############
fetch_lib codemirror git://github.com/marijnh/CodeMirror2.git