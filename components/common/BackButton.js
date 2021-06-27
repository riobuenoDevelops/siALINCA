import {useRouter} from "next/router";
import {Icon, IconButton, Tooltip, Whisper} from "rsuite";

export default function BackButton({ route, placeholder }) {
  const router = useRouter();

  return (
    <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>A {placeholder}</Tooltip>}>
      <IconButton
        style={{margin: "0.3rem 0"}}
        size="sm"
        icon={<Icon className="text-white" icon="angle-left" />}
        appearance="primary"
        className="bg-color-secundary"
        circle
        onClick={() => router.push(`/${route}`)}
      />
    </Whisper>
  );
}