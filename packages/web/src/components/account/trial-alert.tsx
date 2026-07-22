import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function TrialAlert({ daysLeft }: { daysLeft: number }) {
    return (
        <Alert variant={"default"}>
            <AlertDescription>
                Your trial expires in {daysLeft}. To maintain access to premium
                features, upgrade to Pro.
            </AlertDescription>
            <AlertAction position={"block"}>
                <Button size="xs" variant="default">
                    Upgrade
                </Button>
            </AlertAction>
        </Alert>
    );
}
