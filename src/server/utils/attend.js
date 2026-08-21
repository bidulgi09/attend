function attend(user, subject_id) {
    if(!user.log.find(log => log.date === new Date().toISOString().split('T')[0] && log.subject_id == subject_id)) {
        user.log.push({
            date: new Date().toISOString().split('T')[0],
            subject_id: subject_id,
            subject_name: user.subjects.find(subject => subject.id == subject_id).name,
            status: "출석"
        });
    }
}