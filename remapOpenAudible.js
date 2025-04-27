const fs = require('fs');
const path = require('node:path');

function filenameReservedRegex() {
	return /[<>:"/\\|?*\u0000-\u001F]/g;
}

const args = process.argv.slice(2);

if (args.length < 2) {
    console.log("Need arguments: <openaudible-dir> <dest-dir>");
    process.exit(1);
}
const books_info = path.join(args[0], "books.json");
const books_dir = path.join(args[0], "books");

let book_data;
try {
    const data = fs.readFileSync(books_info, 'utf8');
    book_data = JSON.parse(data);
} catch (err) {
    console.error('Error loading books.json:', err);
    process.exit(1);
}

for (let i = 0; i < book_data.length; i++) {
    const rec = book_data[i];
    let destpath;
    let author_fname = rec.author.replace(filenameReservedRegex(), ' ');
    if (rec.series_name) {
        let series_seq = rec.series_sequence || "na";
        console.log(`author=${rec.author}, series=${rec.series_name}, seriesSeq=${series_seq}, name=${rec.filename}`);
        let series_fname = rec.series_name.replace(filenameReservedRegex(), ' ');
        let series_seq_fname = series_seq.replace(filenameReservedRegex(), ' ');
        destpath = path.join(args[1], author_fname, series_fname, `Vol ${series_seq_fname} - ${rec.filename}`);
    }
    else {
        console.log(`author=${rec.author}, name=${rec.filename}`);
        destpath = path.join(args[1], author_fname, rec.filename);
    }
    try {
        fs.mkdirSync(destpath, { recursive: true });
    } catch (err) {
        console.error(`Error creating path ${destpath}:`, err);
        process.exit(1);
    }    
    let files = fs.readdirSync(books_dir).filter(fn => fn.startsWith(rec.filename + '.'));
    for (let file of files) {
        let srcfile = path.join(books_dir, file);
        let tmpfile = path.join(destpath, "tmp.bin");
        let destfile = path.join(destpath, file);
        // If dest already exists, skip it (since we only rename after copy finishes, should either not exist or be valid)
        if (fs.existsSync(destfile)) {
            console.log(`  ${file} already exists`);
            continue;
        }
        console.log(`  Copying ${srcfile} to ${destfile}`);
        try {
            fs.copyFileSync(srcfile, tmpfile);  // Make interrupt safe
            fs.renameSync(tmpfile, destfile);
        } catch (err) {
            console.error(`Error copying ${srcfile} to ${destfile}:`, err);
            process.exit(1);
        }        
    }
}
console.log(`Completed!`);
process.exit(0);