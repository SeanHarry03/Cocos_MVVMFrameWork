import { _decorator,   } from 'cc';
import { VMData } from './Core/VMData';
import { BindVMUI } from './Core/Decorator';
const { ccclass, property } = _decorator;

@ccclass('GameOverItem')
export class GameOverItem extends VMData {

    @BindVMUI({ comName: "Name" })
    Name: string = "21312";

    // @BindVMUI({ comName: "HeadIcon", changeKey: "Color" })
    // HeadIconColor: Color = null;

    @BindVMUI({ comName: "HeadIcon" })
    HeadIconURL: string = "";

    @BindVMUI({ comName: "Score" })
    Score: number = 0;

    protected onLoad(): void {
        // console.log("GameOverItem Onload");
    }

    Init(data: { name: string, headURL: string, score: number }) {
        this.Name = data.name;
        this.HeadIconURL = data.headURL;
        // this.HeadIconColor = Color.RED
        this.Score = data.score;
    }
}

