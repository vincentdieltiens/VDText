#!/bin/bash 



function fetch_lib {
	original_dir=`pwd`
	
	dir=$1
	git_url=$2
	
	if [ ! -e $dir ]; then
		git clone $git_url $dir
	else
		cd $dir
		git fetch $git_url
	fi

	cd $original_dir
}

##############
## Code Mirror
##############
fetch_lib lib/codemirror git://github.com/marijnh/CodeMirror2.git