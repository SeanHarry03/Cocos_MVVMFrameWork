import { _decorator, } from 'cc';
import { BindVMUI } from '../../Scripts/Core/Decorator';
import { VMData } from '../../Scripts/Core/VMData';
const { ccclass, property } = _decorator;

@ccclass('Demo2Item')
export class Demo2Item extends VMData {

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

