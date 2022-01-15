const name = "example";
const group = "minute";
const schedule = "*/1 * * * *";
const deadline = 180;

const command = () => {
    return `Execute ${name} done`;
};

export {
    command,
    name,
    group,
    schedule,
    deadline,
};
