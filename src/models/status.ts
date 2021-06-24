import { sample } from "lodash";

const all = ["😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"];
const current = sample(all);

export const status = {
  all,
  current,
  randomize: function () {
    const old = this.current;
    this.current = sample(this.all.filter((status) => status !== old));
  },
};
